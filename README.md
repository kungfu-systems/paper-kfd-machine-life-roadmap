# Semantic Autopoiesis

This repository tracks the LaTeX source for:

> **Semantic Autopoiesis: An Engineering Roadmap for Machine Life**

The paper asks whether a persistent semantic kernel, replaceable reasoning
agents, recursively developed executable organs, and ordinary computing
infrastructure can form a low-level machine organism. It develops a functional
and falsifiable engineering proposal; it does **not** claim biological life,
sentience, phenomenal consciousness, or completed autonomy.

The proposed anatomy is:

```text
KFD / Kungfu semantics  -> continuity and bounded authority
Agent                   -> replaceable cognition
KFX                     -> executable organs
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
