#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const localTsc = path.join(projectRoot, "node_modules", "typescript", "bin", "tsc");

if (!fs.existsSync(localTsc)) {
  console.error("TypeScript dependencies are not installed. Run `npm ci` first, then `npm run typecheck`.");
  process.exit(2);
}

const result = spawnSync(process.execPath, [localTsc, "--project", "tsconfig.typecheck.json", "--noEmit", "--pretty", "false"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: false,
});

if (result.error) {
  console.error("Could not start TypeScript:", result.error.message);
}

process.exit(result.status ?? 1);
