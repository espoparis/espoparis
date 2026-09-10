#!/usr/bin/env node

/**
 * Verifies every source directory that writes Tailwind classes is covered by a
 * `content` glob in tailwind.config.cjs.
 *
 * This exists because `features/` was missing from the globs for a long time.
 * Tailwind does not warn about that — it just silently omits the classes those
 * files use, so headings, cards, and grids render as unstyled defaults. Nothing
 * fails: not the build, not typecheck, not lint. Only looking at the page shows
 * it. This check turns that into a test failure.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IGNORED = new Set(["node_modules", ".next", ".git", "public", "messages", "scripts"]);

const config = fs.readFileSync(path.join(projectRoot, "tailwind.config.cjs"), "utf8");
const contentBlock = config.match(/content:\s*\[([\s\S]*?)\]/);

if (!contentBlock) {
  console.error("✖ could not find a `content` array in tailwind.config.cjs");
  process.exit(1);
}

const globs = [...contentBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
// Only the leading path segment matters for "is this directory scanned at all".
const coveredRoots = new Set(
  globs
    .map((glob) => glob.split("/")[0])
    .filter((segment) => segment && !segment.includes("*")),
);

/** Top-level directories holding files that write Tailwind classes. */
function findClassNameRoots(dir, root, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name) || entry.name.startsWith(".")) {
      continue;
    }

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      findClassNameRoots(full, root ?? entry.name, out);
      continue;
    }

    if (!/\.tsx?$/.test(entry.name) || !root) {
      continue;
    }

    if (/className\s*=|@apply\b/.test(fs.readFileSync(full, "utf8"))) {
      out.add(root);
    }
  }

  return out;
}

const roots = findClassNameRoots(projectRoot, null, new Set());
const uncovered = [...roots].filter((root) => !coveredRoots.has(root)).sort();

if (uncovered.length) {
  console.error("✖ these directories use Tailwind classes but are not in tailwind.config.cjs `content`:\n");
  for (const root of uncovered) {
    console.error(`  ${root}/  → add "${root}/**/*.{ts,tsx}"`);
  }
  console.error("\nTailwind will silently purge every class used only in those files.");
  process.exit(1);
}

console.log(
  `✔ tailwind content: ${[...roots].sort().join(", ")} all covered by config globs`,
);
