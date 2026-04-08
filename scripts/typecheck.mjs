#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const nextTypesPath = path.join(projectRoot, ".next", "types");
const sourceRoots = [
  "app",
  "components",
  "features",
  "lib",
  "server",
  "middleware.ts",
  "next-env.d.ts",
];

function collectModifiedTimes(targetPath, accumulator) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const stats = fs.statSync(targetPath);
  accumulator.push(stats.mtimeMs);

  if (!stats.isDirectory()) {
    return;
  }

  for (const entry of fs.readdirSync(targetPath)) {
    collectModifiedTimes(path.join(targetPath, entry), accumulator);
  }
}

function getLatestSourceChange() {
  const times = [];

  for (const relativePath of sourceRoots) {
    collectModifiedTimes(path.join(projectRoot, relativePath), times);
  }

  return times.length ? Math.max(...times) : 0;
}

function getGeneratedTypesChange() {
  if (!fs.existsSync(nextTypesPath)) {
    return 0;
  }

  const times = [];
  collectModifiedTimes(nextTypesPath, times);
  return times.length ? Math.max(...times) : 0;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (getGeneratedTypesChange() < getLatestSourceChange()) {
  run("npx", ["next", "build", "--no-lint"]);
}

run("npx", ["tsc", "--noEmit"]);
