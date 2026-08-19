#!/usr/bin/env node
// Standalone build script for bidii-site — avoids pnpm recursive runner
// so Vercel shows the real Vite error instead of swallowing it.

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.join(root, "artifacts", "bidii-site");

console.log("Building bidii-site from:", siteDir);

try {
  execSync("npx vite build --config vite.config.ts", {
    cwd: siteDir,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      BASE_PATH: process.env.BASE_PATH ?? "/",
    },
  });
  console.log("Build complete.");
} catch (err) {
  console.error("Build failed:", err.message);
  process.exit(1);
}
