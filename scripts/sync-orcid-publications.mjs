import fs from "node:fs/promises";
import path from "node:path";

const ORCID_ID = process.env.ORCID_ID || "0009-0007-2952-7788";
const AUTHOR_NAME = process.env.AUTHOR_NAME || "Tianhao Li";
const OUTPUT_PATH = path.resolve("data/publications/orcid-works.json");
const USER_AGENT = "Tianhao-Li-academic-website/0.1";

const headers = {
  Accept: "application/json",
  "User-Agent": USER_AGENT,
};

function normalizeName(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getDoi(externalIds = []) {
  return externalIds.find((item) => item["external-id-type"] === "doi")?.["external-id-value"] || null;
}

function getDatePart(publicationDate, part) {
  const value = publicationDate?.[part]?.value;
  return value ? Number(value) : null;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return response.json();
}

async function getCrossrefMetadata(doi) {
  const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const message = payload.message;
  const authors = message?.author || [];
  const dateParts = message?.published?.["date-parts"]?.[0] || message?.issued?.["date-parts"]?.[0] || [];

  return {
    authors: authors.map((author) => [author.given, author.family].filter(Boolean).join(" ").trim()),
    venue: message?.["container-title"]?.[0] || "",
    volume: message?.volume || null,
    issue: message?.issue || null,
    pages: message?.page || null,
    publishedYear: dateParts[0] || null,
    publishedMonth: dateParts[1] || null,
  };
}

const summary = await fetchJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`);
const workSummaries = summary.group.flatMap((group) => group["work-summary"] || []);
const worksByDoi = new Map();

for (const item of workSummaries) {
  const detail = await fetchJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/work/${item["put-code"]}`);
  const doi = getDoi(detail["external-ids"]?.["external-id"]);
  if (!doi) {
    console.warn(`Skipping ORCID work without DOI: ${detail.title?.title?.value || item["put-code"]}`);
    continue;
  }

  const crossref = await getCrossrefMetadata(doi);
  if (!crossref) {
    console.warn(`Skipping work because Crossref metadata is unavailable: ${doi}`);
    continue;
  }

  const authorMatched = crossref.authors.some((name) => normalizeName(name) === normalizeName(AUTHOR_NAME));
  if (!authorMatched) {
    console.warn(`Skipping DOI because Crossref author list does not contain ${AUTHOR_NAME}: ${doi}`);
    continue;
  }

  const record = {
    orcidPutCode: detail["put-code"],
    title: detail.title?.title?.value || item.title?.title?.value || "Untitled",
    authors: (detail.contributors?.contributor || [])
      .map((author) => author["credit-name"]?.value)
      .filter(Boolean),
    year: crossref.publishedYear || getDatePart(detail["publication-date"], "year"),
    month: crossref.publishedMonth || getDatePart(detail["publication-date"], "month"),
    day: getDatePart(detail["publication-date"], "day"),
    type: detail.type || item.type,
    venue: crossref.venue || detail["journal-title"]?.value || item["journal-title"]?.value || "",
    volume: crossref.volume,
    issue: crossref.issue,
    pages: crossref.pages,
    doi: doi.toLowerCase(),
    url: `https://doi.org/${doi}`,
    verified: {
      orcid: true,
      crossref: true,
      authorMatch: true,
    },
  };

  const key = record.doi.toLowerCase();
  const current = worksByDoi.get(key);
  if (!current) {
    worksByDoi.set(key, record);
  } else {
    worksByDoi.set(key, {
      ...current,
      ...Object.fromEntries(Object.entries(record).filter(([, value]) => value !== null && value !== "")),
      authors: record.authors.length >= current.authors.length ? record.authors : current.authors,
    });
  }
}

const works = Array.from(worksByDoi.values()).sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return (b.month || 0) - (a.month || 0) || a.title.localeCompare(b.title);
});

const output = {
  generatedAt: new Date().toISOString(),
  orcid: `https://orcid.org/${ORCID_ID}`,
  authorName: AUTHOR_NAME,
  source: "ORCID public API, cross-checked against Crossref DOI metadata",
  note: "This file contains automatically fetched metadata. Curated fields such as selected, preview, PDF, code, and description are maintained in content/publications.bib.",
  works,
};

await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Wrote ${works.length} verified works to ${path.relative(process.cwd(), OUTPUT_PATH)}`);