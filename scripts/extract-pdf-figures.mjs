import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as mupdf from "mupdf";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PDF_DIR = process.env.PDF_DIR || path.resolve(ROOT, "..", "temple_paper");
const OUT_DIR = path.join(ROOT, "public", "papers", "local-figures");
const REPORT = path.join(ROOT, "data", "publications", "figure-extraction.json");
const DPI = 300;
const MAX_WIDTH = 2000;
const CLUSTER_GAP = 30;

// Figures are exported by rendering the page region rather than pulling an
// embedded raster: several publishers place a flattened image behind vector
// text, so the embedded image alone loses every label.
const PAPERS = [
  ["bcdb", "He 等 - 2025 - BCDB A dual-branch network based on transformer for predicting transcription factor binding sites.pdf", 3, 1, "bcdb-figure1.webp"],
  ["distribution2025", "He 等 - 2025 - Distribution and Knowledge Alignment-based Single-cell Multi-omics Cell Type Annotation.pdf", 3, 2, "alignment-figure2.webp"],
  ["leap", "He 等 - 2026 - LEAP Long sequence enhancer activity analysis and prediction framework.pdf", 3, 1, "leap-figure1.webp"],
  ["sctchcn", "Li 等 - 2024 - Cell-Specific Highly Correlated Network for Self-Supervised Distillation in Cell Type Annotation.pdf", 3, 1, "sctchcn-figure1.webp"],
  ["longtail", "Li 等 - 2026 - Distribution and expression aware retrospective learning for single-cell long-tailed class-increment.pdf", 3, 2, "longtail-figure2.webp"],
  ["sad", "Li 等 - 2026 - SAD Sparse-Aware Diffusion Model for Single-Cell Gene Expression Completion.pdf", 3, 2, "sad-figure2.webp"],
  ["peft2023", "Liu 等 - 2023 - Exploring Parameter-Efficient Fine-Tuning of a Large-Scale Pre-Trained Model for scRNA-seq Cell Type.pdf", 3, 1, "peft2023-figure1.webp"],
  ["peft2024", "Xia 等 - 2024 - Assessing parameter efficient methods for pre-trained language model in annotating scRNA-seq data.pdf", 3, 1, "peft2024-figure1.webp"],
  ["scmoanno", "Zhang 等 - 2025 - Supervised pre-training for feature extraction in cell type annotation of single-cell multi-omics da.pdf", 4, 2, "scmoanno-figure2.webp"],
  ["scdpr", "Zhang 等 - 2026 - Deep generative framework for modeling single-cell drug perturbation response.pdf", 4, 1, "scdpr-figure1.webp"],
  ["scbrf", "Zhang 等 - 2027 - A gene signature-guided bidirectional retrieval framework for single-cell RNA-seq analysis.pdf", 5, 2, "scbrf-figure2.webp"],
  ["clsfdti", "Zhang 等 - 2026 - Contrastive learning in both structure and function spaces improve drug-target interaction predictio.pdf", 4, 2, "clsfdti-figure2.webp"],
  ["comet", "IJCNN-26-CameraReady.pdf", 3, 1, "comet-figure1.webp"],
];

const rect = (x0, y0, x1, y1) => ({ x0, y0, x1, y1 });
const fromXYWH = (r) => rect(r.x, r.y, r.x + r.w, r.y + r.h);
const fromBounds = (b) => (Array.isArray(b)
  ? rect(b[0], b[1], b[2], b[3])
  : rect(b.x0, b.y0, b.x1, b.y1));
const union = (rects) => rects.reduce((a, b) => rect(
  Math.min(a.x0, b.x0), Math.min(a.y0, b.y0), Math.max(a.x1, b.x1), Math.max(a.y1, b.y1),
));
const area = (r) => Math.max(0, r.x1 - r.x0) * Math.max(0, r.y1 - r.y0);
const near = (a, b, gap) => a.x0 - gap <= b.x1 && b.x0 - gap <= a.x1 && a.y0 - gap <= b.y1 && b.y0 - gap <= a.y1;

// Isolated rules and stray marks from neighbouring columns must not stretch the
// figure bounds, so keep only the largest connected group of artwork.
function dominantCluster(rects, gap) {
  let clusters = rects.map((r) => ({ bounds: r, area: area(r) }));
  let changed = true;
  while (changed) {
    changed = false;
    const merged = [];
    for (const cluster of clusters) {
      const hit = merged.find((o) => near(o.bounds, cluster.bounds, gap));
      if (hit) {
        hit.bounds = union([hit.bounds, cluster.bounds]);
        hit.area += cluster.area;
        changed = true;
      } else {
        merged.push(cluster);
      }
    }
    clusters = merged;
  }
  return clusters.reduce((best, c) => (c.area > best.area ? c : best)).bounds;
}

function captionRect(page, figureNumber) {
  const pattern = new RegExp(`Fig\\.?\\s*${figureNumber}(?:\\.|\\s)`, "i");
  const { blocks } = JSON.parse(page.toStructuredText("preserve-whitespace").asJSON());
  for (const block of blocks) {
    if (block.type !== "text") continue;
    const text = (block.lines || []).map((line) => line.text).join(" ");
    if (pattern.test(text)) return fromXYWH(block.bbox);
  }
  throw new Error(`Figure ${figureNumber} caption not found`);
}

function collectGeometry(page) {
  const artworks = [];
  const labels = [];
  const stroke = new mupdf.StrokeState({ lineCap: "Butt", lineJoin: "Miter", lineWidth: 0, miterLimit: 10 });
  const device = new mupdf.Device({
    fillPath(p, _evenOdd, ctm) { artworks.push(fromBounds(p.getBounds(stroke, ctm))); },
    strokePath(p, ss, ctm) { artworks.push(fromBounds(p.getBounds(ss, ctm))); },
    fillImage(_image, ctm) { artworks.push(imageBounds(ctm)); },
    fillImageMask(_image, ctm) { artworks.push(imageBounds(ctm)); },
    fillText(t, ctm) { labels.push(fromBounds(t.getBounds(stroke, ctm))); },
    strokeText(t, ss, ctm) { labels.push(fromBounds(t.getBounds(ss, ctm))); },
  });
  page.run(device, mupdf.Matrix.identity);
  return { artworks, labels };
}

function imageBounds(ctm) {
  const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => [
    ctm[0] * x + ctm[2] * y + ctm[4],
    ctm[1] * x + ctm[3] * y + ctm[5],
  ]);
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  return rect(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
}

function figureBounds(page, figureNumber) {
  const pageRect = fromBounds(page.getBounds());
  const caption = captionRect(page, figureNumber);
  const top = Math.max(12, pageRect.y1 * 0.035);
  const bottom = caption.y0 - 2;
  const inBand = (r) => r.y0 >= top && r.y1 <= bottom + 2 && area(r) > 4;

  const { artworks, labels } = collectGeometry(page);
  const artworkBounds = dominantCluster(artworks.filter(inBand), CLUSTER_GAP);

  const padded = rect(artworkBounds.x0 - 2, artworkBounds.y0 - 2, artworkBounds.x1 + 2, artworkBounds.y1 + 2);
  const insideLabels = labels.filter((r) => {
    if (!inBand(r)) return false;
    const cx = (r.x0 + r.x1) / 2;
    const cy = (r.y0 + r.y1) / 2;
    return cx >= padded.x0 && cx <= padded.x1 && cy >= padded.y0 && cy <= padded.y1;
  });

  const merged = union([artworkBounds, ...insideLabels]);
  return rect(
    Math.max(pageRect.x0, merged.x0 - 4),
    Math.max(pageRect.y0, merged.y0),
    Math.min(pageRect.x1, merged.x1 + 4),
    Math.min(pageRect.y1, caption.y0 - 3, merged.y1 + 4),
  );
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  const scale = DPI / 72;
  const records = [];

  for (const [id, filename, pageNumber, figureNumber, outputName] of PAPERS) {
    const doc = mupdf.Document.openDocument(fs.readFileSync(path.join(PDF_DIR, filename)), "application/pdf");
    const page = doc.loadPage(pageNumber - 1);
    const bounds = figureBounds(page, figureNumber);

    const pixmap = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false, true);
    const left = Math.max(0, Math.round(bounds.x0 * scale));
    const top = Math.max(0, Math.round(bounds.y0 * scale));
    const width = Math.min(pixmap.getWidth() - left, Math.round((bounds.x1 - bounds.x0) * scale));
    const height = Math.min(pixmap.getHeight() - top, Math.round((bounds.y1 - bounds.y0) * scale));

    let pipeline = sharp(Buffer.from(pixmap.asPNG())).extract({ left, top, width, height });
    if (width > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH, kernel: "lanczos3" });
    const info = await pipeline.webp({ quality: 90, effort: 6 }).toFile(path.join(OUT_DIR, outputName));

    records.push({
      id,
      pdf: filename,
      page: pageNumber,
      figure: figureNumber,
      pdfBounds: [bounds.x0, bounds.y0, bounds.x1, bounds.y1].map((v) => Math.round(v * 1000) / 1000),
      output: outputName,
      width: info.width,
      height: info.height,
      bytes: info.size,
    });
    console.log(`${id} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
  }

  fs.writeFileSync(REPORT, JSON.stringify({ dpi: DPI, papers: records }, null, 2) + "\n", "utf8");
  console.log(`Wrote ${records.length} figures to ${path.relative(ROOT, OUT_DIR)}`);
}

main();
