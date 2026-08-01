# Semantic Autopoiesis

This repository tracks the LaTeX source for:

> **Semantic Autopoiesis: An Engineering Roadmap for Machine Life**

The paper asks whether a persistent semantic kernel, replaceable reasoning
agents, qualified KFX extensions serving as recursively developed executable
organs, and ordinary computing infrastructure can form a low-level machine
organism. It develops a functional and falsifiable engineering proposal; it
does **not** claim biological life, sentience, phenomenal consciousness, or
completed autonomy.

The proposed anatomy is:

```text
KFD / Kungfu semantics  -> continuity and bounded authority
Agent                   -> replaceable cognition
qualified KFX extension -> may serve as an executable organ
servers and toolchains  -> material body and metabolism
recursive dogfood       -> governed self-modification
```

## Claim Boundary

The paper separates:

- observed Kungfu mechanisms as of 29 July 2026;
- engineering inferences that follow from composing those mechanisms;
- hypotheses that require longitudinal survival trials.

Current evidence supports the existence of several required mechanisms, not a
completed machine-life system. In particular, the first alpha records an open
Product Release Cut integration boundary and proposes explicit tests for
continuity, self-maintenance, adaptation, bounded autonomy, and recovery.

## Layout

- [`paper/main.tex`](paper/main.tex): LaTeX entrypoint.
- [`paper/sections/`](paper/sections/): paper sections.
- [`paper/references.bib`](paper/references.bib): bibliography.
- [`docs/MAP.md`](docs/MAP.md): repository map.
- [`site/brand-site.json`](site/brand-site.json): generated reader bundle for
  `kungfu.tech`.

## Site Bundle

The npm publication includes a generated brand-site bundle for the canonical
Machine Life reader on `kungfu.tech`. The bundle derives its complete section
order and reader Markdown from the LaTeX source while preserving the paper's
future-facing, functional, falsifiable, and non-consciousness claim boundary.
Its canonical brand-site reader and PDF routes share the `kungfu-machine-life`
filename. The brand bundle does not declare alternate reader or PDF slugs.

Regenerate it after changing the paper source or publication metadata:

```sh
make update-site-bundles
```

`papers.libkungfu.dev` remains the publication evidence and immutable archive
host. The brand reader links back to that evidence rather than becoming a
second publication authority.

## Build

CI builds the PDF through Buildchain's pinned LaTeX Docker toolchain declared
in [`.buildchain/buildchain.toml`](.buildchain/buildchain.toml).
Buildchain also writes the publication manifest, passport, archive registry,
source bundle, npm package, release evidence, and GitHub Release.

The package coordinate is:

```text
@kungfu-tech/paper-kfd-machine-life-roadmap
```

npm Trusted Publishing must be configured against this repository and
`.github/workflows/paper-release.yml`.

## Agent-native release propagation

A successful alpha or release publication emits Buildchain propagation work
units for the downstream sites declared in
[`.buildchain/release-propagation.json`](.buildchain/release-propagation.json).
Those work units are agent handoff records, not approval substitutes: the
receiving agent must verify the npm integrity, exact source `gitHead`, Git tag,
GitHub Release evidence, and downstream release lock before running the
declared site update and readback commands. A missing or conflicting link keeps
the work unit fail-closed.

Source-only checks:

```sh
make check
```

If Tectonic is installed:

```sh
make pdf
```

Publisher: Kungfu Origin Technology Limited.

Author: Keren Dong <keren.dong@kungfu.link>.
