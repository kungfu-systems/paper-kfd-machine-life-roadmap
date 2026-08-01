import { readFileSync } from "node:fs";
import { buildSiteBundles } from "./update-site-bundles.mjs";

const fail = (message) => {
  console.error(`check: ${message}`);
  process.exitCode = 1;
};

const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = (filePath) => JSON.parse(readFileSync(filePath, "utf8"));

for (const [filePath, expected] of Object.entries(buildSiteBundles())) {
  let actual;
  try {
    actual = readJson(filePath);
  } catch (error) {
    fail(`${filePath} is missing or invalid JSON: ${error.message}`);
    continue;
  }
  if (stable(actual) !== stable(expected)) {
    fail(`${filePath} is stale; run make update-site-bundles`);
  }
}

const brand = readJson("site/brand-site.json");
if (brand.contract !== "kungfu-machine-life-brand-site-bundle" || brand.consumer !== "kungfu.tech") {
  fail("brand bundle must declare the Machine Life kungfu.tech consumer contract");
}
if (brand.routes?.canonicalUrl !== "https://kungfu.tech/whitepaper/kfd-machine-life-roadmap") {
  fail("brand bundle must declare the canonical kungfu.tech Machine Life reader");
}
if (brand.routes?.pdfUrl !== "https://kungfu.tech/whitepaper/kungfu-machine-life.pdf") {
  fail("brand bundle must declare the local Machine Life PDF route");
}
if (JSON.stringify(brand.routes?.pdfAliases) !== JSON.stringify(["/whitepaper/kfd-machine-life-roadmap.pdf"])) {
  fail("brand bundle must preserve the previous Machine Life PDF route as an alias");
}
if (brand.routes?.evidenceUrl !== "https://papers.libkungfu.dev/kfd-machine-life-roadmap/") {
  fail("brand bundle must preserve papers.libkungfu.dev as the evidence authority");
}
if (brand.homepageSections?.length !== 11) {
  fail("brand bundle must expose all eleven paper sections");
}

const main = readFileSync("paper/main.tex", "utf8");
if (!main.includes(`Alpha ${brand.source.packageVersion}`)) {
  fail("paper/main.tex must identify the declared publication version");
}
const sourceSections = [...main.matchAll(/\\input\{sections\/([^}]*)\}/g)]
  .map((match) => `paper/sections/${match[1]}.tex`);
const bundleSections = brand.homepageSections?.map((section) => section.sourcePath) || [];
if (stable(bundleSections) !== stable(sourceSections)) {
  fail("brand bundle section order must match paper/main.tex exactly");
}

for (const section of brand.homepageSections || []) {
  if (!section.markdown?.trim()) fail(`section ${section.id} must include reader Markdown`);
  if (/\\/.test(section.markdown || "")) {
    fail(`section ${section.id} contains unrendered LaTeX commands`);
  }
}

const buildchain = readFileSync(".buildchain/buildchain.toml", "utf8");
for (const required of [
  'site_consumers = ["kungfu.tech", "papers.libkungfu.dev"]',
  '"site/brand-site.json"',
  '"site/site-bundles.json"',
]) {
  if (!buildchain.includes(required)) fail(`Buildchain publication contract must include ${required}`);
}

if (!brand.positioning?.claimBoundary?.includes("does not claim biological life")) {
  fail("brand bundle must preserve the paper's explicit non-claim boundary");
}

if (process.exitCode) process.exit(process.exitCode);
