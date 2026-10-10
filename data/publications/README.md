# Publication data

`content/publications.bib` is the single source of truth for the website.

- `data/publications/orcid-works.json` is an automatically generated metadata snapshot from the ORCID public API, verified against Crossref.
- Manual presentation fields such as `selected`, `selected_order`, `preview`, `description`, `pdfUrl`, and `code` belong in `content/publications.bib`, not in the generated JSON.
- Run `npm run sync:metadata` to refresh the JSON snapshot. It does not overwrite the BibTeX file.

For a future fully automatic workflow, merge generated records into a separate BibTeX database by normalized DOI, preserve existing manual fields, deduplicate DOI values case-insensitively, and then rebuild the static site in GitHub Actions.

## V0.3 figure assets

- `local-pdf-inventory.json` records the local manuscript inventory used for figure extraction.
- `local-figure-assets.json` records processed figure paths, dimensions, and source type.
- `europepmc-enrichment.json` stores abstract/open-access metadata retrieved from Europe PMC.
- `content/publication-details.json` is the editable source for paper summaries, figure captions, links, and verification status.
- Do not commit publisher PDFs unless their redistribution terms permit it. The website stores only processed figures explicitly authorized for this personal site.

## Figure extraction

`scripts/extract-pdf-figures.mjs` locates each figure caption with MuPDF, takes the dominant cluster of artwork above it, and renders that page region at 300 DPI. It never extracts the embedded raster on its own: several publishers place a flattened image behind vector text, so the embedded image alone loses every label.

```bash
npm run extract:figures
```

The source PDFs come from `../temple_paper` by default; override with `PDF_DIR=<path>`. Boundary and output metadata are written to `data/publications/figure-extraction.json`.
