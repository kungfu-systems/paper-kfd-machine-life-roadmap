import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const read = (filePath) => readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
const compact = (value) => String(value || "").replace(/\s+/g, " ").trim();

const parseTomlString = (toml, key) => {
  const match = toml.match(new RegExp(`^${key}\\s*=\\s*"([^"]*)"`, "m"));
  return match ? match[1] : "";
};

const parseTomlArray = (toml, key) => {
  const match = toml.match(new RegExp(`^${key}\\s*=\\s*\\[([^\\]]*)\\]`, "m"));
  if (!match) return [];
  return match[1]
    .split(",")
    .map((item) => item.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
};

const parseBuildchain = () => {
  const toml = read(".buildchain/buildchain.toml");
  return {
    title: parseTomlString(toml, "title"),
    version: parseTomlString(toml, "version"),
    abstract: parseTomlString(toml, "abstract"),
    siteConsumers: parseTomlArray(toml, "site_consumers"),
  };
};

const removeFigureBodies = (latex) => latex.replace(
  /\\begin\{figure\}(?:\[[^\]]*\])?[\s\S]*?\\end\{figure\}/g,
  "\n_[Figure available in the primary PDF.]_\n",
);

const normalizeLatex = (source) => removeFigureBodies(source)
  .replace(/%.*$/gm, "")
  .replace(/\\(?:factlabel)/g, "**Observed fact.**")
  .replace(/\\(?:inferencelabel)/g, "**Engineering inference.**")
  .replace(/\\(?:hypothesislabel)/g, "**Testable hypothesis.**")
  .replace(/\\(?:nonclaimlabel)/g, "**Non-claim.**")
  .replace(/\\href\{([^{}]*)\}\{([^{}]*)\}/g, "[$2]($1)")
  .replace(/\\url\{([^{}]*)\}/g, "$1")
  .replace(/\\begin\{(?:table|tabularx|tabular|center|minipage|quote|enumerate|itemize|aligned|cases)\}(?:\[[^\]]*\])?(?:\{[^\n]*\})?/g, "")
  .replace(/\\end\{(?:table|tabularx|tabular|center|minipage|quote|enumerate|itemize|aligned|cases)\}/g, "")
  .replace(/\\(?:toprule|midrule|bottomrule|centering|small|footnotesize|medskip|bigskip)/g, "")
  .replace(/\\(?:caption|label)\{[^{}]*\}/g, "")
  .replace(/(Table|Figure)~?\\ref\{[^{}]*\}/g, (_, kind) => `the corresponding primary-PDF ${kind.toLowerCase()}`)
  .replace(/\\(?:cite|nocite)\{[^}]*\}/g, "")
  .replace(/\\item\s+/g, "- ")
  .replace(/\\paragraph\{([^}]*)\}/g, "\n### $1\n")
  .replace(/\\subsection\{([^}]*)\}/g, "\n## $1\n")
  .replace(/\\section\{([^}]*)\}/g, "# $1\n")
  .replace(/\\(?:textit|emph)\{([^{}]*)\}/g, "_$1_")
  .replace(/\\textbf\{([^{}]*)\}/g, "**$1**")
  .replace(/\\texttt\{([^{}]*)\}/g, "`$1`")
  .replace(/\\operatorname\{([^{}]*)\}/g, "$1")
  .replace(/\\text\{([^{}]*)\}/g, "$1")
  .replace(/\\rightarrow/g, "→")
  .replace(/\\longrightarrow/g, "→")
  .replace(/\\Downarrow/g, "⇓")
  .replace(/\\neq/g, "≠")
  .replace(/\\Delta/g, "Δ")
  .replace(/\\times/g, "×")
  .replace(/\\geq/g, "≥")
  .replace(/\\leq/g, "≤")
  .replace(/\\"o/g, "ö")
  .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
  .replace(/\$+/g, "")
  .replace(/\s*&\s*/g, " | ")
  .replace(/\s*\\\\\s*/g, "\n")
  .replace(/``/g, "\"")
  .replace(/''/g, "\"")
  .replace(/---/g, "—")
  .replace(/~/g, " ")
  .replace(/\\&/g, "&")
  .replace(/\\_/g, "_")
  .replace(/\\#/g, "#")
  .replace(/\\%/g, "%")
  .replace(/\\\s/g, " ")
  .replace(/\\-/g, "-")
  .replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?(?:\{([^{}]*)\})?/g, (_, inner) => inner || "")
  .replace(/[{}]/g, "")
  .replace(/^\s*>?(?:p\d+(?:\.\d+)?|X@?)\s*$/gm, "")
  .replace(/[ \t]+\n/g, "\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const sectionPaths = () => {
  const main = read("paper/main.tex");
  return [...main.matchAll(/\\input\{sections\/([^}]*)\}/g)]
    .map((match) => `paper/sections/${match[1]}.tex`);
};

const parseSection = (filePath) => {
  const latex = read(filePath);
  const sectionMatch = latex.match(/\\section\{([^}]*)\}/);
  const title = sectionMatch ? sectionMatch[1] : filePath;
  const body = sectionMatch ? latex.slice(sectionMatch.index + sectionMatch[0].length) : latex;
  const markdown = normalizeLatex(latex);
  const summary = normalizeLatex(body)
    .split(/\n{2,}/)
    .map((block) => compact(block.replace(/^#{1,3}\s+.*$/gm, "")))
    .find(Boolean) || "";
  return {
    id: filePath.split("/").pop().replace(/\.tex$/, ""),
    sourcePath: filePath,
    title,
    summary,
    markdown,
  };
};

const roleFor = (index) => index === 0 ? "first-screen" : index < 8 ? "primary" : "support";
const presentations = [
  "machine-life-thesis",
  "engineering-definition",
  "semantic-kernel",
  "recursive-dogfood",
  "material-anatomy",
  "kungfu-evidence",
  "prototype-roadmap",
  "evaluation-and-safety",
  "related-work",
  "discussion",
  "bounded-conclusion",
];

export const buildSiteBundles = () => {
  const publication = parseBuildchain();
  const sections = sectionPaths().map(parseSection);
  const source = {
    package: "@kungfu-tech/paper-kfd-machine-life-roadmap",
    packageVersion: publication.version,
    repository: "git+https://github.com/kungfu-systems/paper-kfd-machine-life-roadmap.git",
    titleSource: ".buildchain/buildchain.toml",
    paperEntrypoint: "paper/main.tex",
    sectionSources: sections.map((section) => section.sourcePath),
    bibliography: "paper/references.bib",
    buildchainConfig: ".buildchain/buildchain.toml",
  };

  const brand = {
    schemaVersion: 1,
    contract: "kungfu-machine-life-brand-site-bundle",
    consumer: "kungfu.tech",
    source,
    routes: {
      canonicalHost: "kungfu.tech",
      canonicalPath: "/whitepaper/kungfu-machine-life",
      canonicalUrl: "https://kungfu.tech/whitepaper/kungfu-machine-life",
      indexPath: "/whitepaper",
      indexUrl: "https://kungfu.tech/whitepaper",
      pdfPath: "/whitepaper/kungfu-machine-life.pdf",
      pdfUrl: "https://kungfu.tech/whitepaper/kungfu-machine-life.pdf",
      pdfAliases: [],
      evidenceUrl: "https://papers.libkungfu.dev/kfd-machine-life-roadmap/",
    },
    hero: {
      eyebrow: "Future · Machine Life",
      title: publication.title,
      lead: publication.abstract,
      stance: "Treat machine life as a bounded, falsifiable engineering program built from semantic continuity, replaceable cognition, executable organs, and governed self-production.",
      primaryCta: {
        label: "Read Machine Life",
        href: "https://kungfu.tech/whitepaper/kungfu-machine-life",
      },
      secondaryCta: {
        label: "Inspect publication evidence",
        href: "https://papers.libkungfu.dev/kfd-machine-life-roadmap/",
      },
    },
    positioning: {
      audience: ["Agent builders", "systems engineers", "machine-life researchers", "technology stewards"],
      researchClaim: "Ordinary software-engineering materials may be sufficient to construct and experimentally study a primitive form of machine life.",
      claimBoundary: "The paper does not claim biological life, sentience, phenomenal consciousness, unrestricted autonomy, or a completed self-sustaining Kungfu organism.",
      proofPath: "A staged architecture, explicit claim classes, survival trials, falsifiers, safety controls, and immutable publication evidence.",
    },
    principles: [],
    homepageSections: sections.map((section, index) => ({
      ...section,
      role: roleFor(index),
      presentation: presentations[index],
      priority: (index + 1) * 10,
    })),
    displayPlan: {
      firstScreen: ["hero", sections[0].title],
      primary: sections.slice(1, 8).map((section) => section.title),
      support: sections.slice(8).map((section) => section.title),
      hideFromBrandPage: ["full bibliography", "source bundle internals", "raw Buildchain passport fields"],
    },
  };

  return {
    "site/brand-site.json": brand,
    "site/site-bundles.json": {
      schemaVersion: 1,
      contract: "kungfu-machine-life-site-bundles-index",
      source,
      bundles: [
        {
          id: "brand",
          consumer: "kungfu.tech",
          path: "site/brand-site.json",
          contract: brand.contract,
          purpose: "Future-facing Machine Life reader for the Kungfu main site.",
        },
      ],
    },
  };
};

const writeJson = (filePath, value) => {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [filePath, value] of Object.entries(buildSiteBundles())) {
    writeJson(filePath, value);
    console.log(`updated ${filePath}`);
  }
}
