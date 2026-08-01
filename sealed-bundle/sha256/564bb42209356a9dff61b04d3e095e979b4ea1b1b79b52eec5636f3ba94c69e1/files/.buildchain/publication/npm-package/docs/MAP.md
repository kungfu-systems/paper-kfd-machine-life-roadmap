# Repository Map

## Paper

- `paper/main.tex` — document entrypoint, title, abstract, and section order.
- `paper/sections/01-introduction.tex` — research question and claim classes.
- `paper/sections/02-life-as-an-engineering-property.tex` — operational definition of proto-life.
- `paper/sections/03-semantic-kernel.tex` — KFD continuity and authority.
- `paper/sections/04-recursive-dogfood.tex` — governed self-modification loop.
- `paper/sections/05-material-anatomy.tex` — Agent, KFX, and machine substrate.
- `paper/sections/06-kungfu-evidence.tex` — implementation evidence snapshot.
- `paper/sections/07-prototype-and-roadmap.tex` — minimal organism and stages.
- `paper/sections/08-evaluation-and-safety.tex` — falsifiers and containment.
- `paper/sections/09-related-work.tex` — relationship to prior work.
- `paper/sections/10-discussion.tex` — implications and open questions.
- `paper/sections/11-conclusion.tex` — bounded conclusion.
- `paper/references.bib` — bibliography and primary evidence links.
- `site/brand-site.json` — generated complete reader content for `kungfu.tech`.
- `site/site-bundles.json` — package-owned site-bundle index and consumer contract.
- `scripts/update-site-bundles.mjs` — deterministic LaTeX-to-reader projection.
- `scripts/check-site-bundles.mjs` — source, route, and claim-boundary drift checks.

## Build and Governance

- `.buildchain/buildchain.toml` — publication identity, toolchain, archive, and npm package declaration.
- `.buildchain/*contract-lock.json` — pinned Buildchain contracts.
- `.github/workflows/` — Buildchain verification and release entrypoints.
- `Makefile` — local source checks and optional PDF build.
