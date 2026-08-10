#!/usr/bin/env node

/**
 * Verifies every locale file matches the English source in shape.
 *
 * The site ships four locales and most reviewers only read one of them, so a
 * missing key or a short array is easy to merge and hard to notice. This runs in
 * `npm test` and fails loudly rather than letting a locale silently degrade.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const messagesDir = path.join(projectRoot, "messages");
const SOURCE_LOCALE = "en";

function readMessages(locale) {
  return JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf8"));
}

/** Describes a value's shape: leaf type, object keys, or array length. */
function describe(value, keyPath, out) {
  if (Array.isArray(value)) {
    out.set(keyPath, `array:${value.length}`);
    value.forEach((entry, index) => describe(entry, `${keyPath}[${index}]`, out));
    return out;
  }

  if (value && typeof value === "object") {
    out.set(keyPath, "object");
    for (const [key, child] of Object.entries(value)) {
      describe(child, keyPath ? `${keyPath}.${key}` : key, out);
    }
    return out;
  }

  out.set(keyPath, typeof value);
  return out;
}

const locales = fs
  .readdirSync(messagesDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => path.basename(file, ".json"))
  .sort();

const sourceShape = describe(readMessages(SOURCE_LOCALE), "", new Map());
const problems = [];

for (const locale of locales) {
  const messages = readMessages(locale);
  const shape = describe(messages, "", new Map());

  for (const [keyPath, expected] of sourceShape) {
    if (!shape.has(keyPath)) {
      problems.push(`${locale}: missing "${keyPath}"`);
      continue;
    }

    const actual = shape.get(keyPath);

    if (actual !== expected) {
      problems.push(`${locale}: "${keyPath}" is ${actual}, expected ${expected}`);
    }
  }

  for (const keyPath of shape.keys()) {
    if (!sourceShape.has(keyPath)) {
      problems.push(`${locale}: unexpected "${keyPath}" (not in ${SOURCE_LOCALE})`);
    }
  }

  // An empty string renders as a blank heading rather than a visible failure.
  for (const [keyPath, value] of shape) {
    if (value === "string") {
      const resolved = keyPath
        .split(/[.[\]]+/)
        .filter(Boolean)
        .reduce((node, key) => node?.[key], messages);

      if (typeof resolved === "string" && resolved.trim() === "") {
        problems.push(`${locale}: "${keyPath}" is empty`);
      }
    }
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} message problem(s):\n`);
  for (const problem of problems) {
    console.error(`  ${problem}`);
  }
  process.exit(1);
}

console.log(
  `✔ messages: ${locales.length} locales (${locales.join(", ")}) match ${SOURCE_LOCALE} across ${sourceShape.size} paths`,
);
