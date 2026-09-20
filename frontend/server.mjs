import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

const requiredBuildFiles = [".next/BUILD_ID", ".next/prerender-manifest.json"];

function getNewestModifiedTime(target) {
  if (!existsSync(target)) return 0;
  const stats = statSync(target);
  if (!stats.isDirectory()) return stats.mtimeMs;
  return readdirSync(target, { withFileTypes: true }).reduce(
    (newest, entry) =>
      Math.max(newest, getNewestModifiedTime(`${target}/${entry.name}`)),
    stats.mtimeMs,
  );
}

const buildTime = existsSync(".next/BUILD_ID") ? statSync(".next/BUILD_ID").mtimeMs : 0;
const sourceTime = Math.max(
  getNewestModifiedTime("src"),
  getNewestModifiedTime("public"),
  getNewestModifiedTime("package.json"),
  getNewestModifiedTime("next.config.ts"),
);
const buildIsStale = sourceTime > buildTime;

if (!requiredBuildFiles.every((file) => existsSync(file)) || buildIsStale) {
  console.log("Build produksi belum tersedia; menjalankan Next.js build...");
  rmSync(".next", { recursive: true, force: true });
  const require = createRequire(import.meta.url);
  const nextCli = require.resolve("next/dist/bin/next");
  const build = spawnSync(process.execPath, [nextCli, "build", "--webpack"], {
    stdio: "inherit",
    env: process.env,
  });

  if (build.error) {
    throw build.error;
  }

  if (build.status !== 0) {
    throw new Error(`Next.js build gagal dengan exit code ${build.status ?? 1}.`);
  }
}

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
      console.log(`Frontend berjalan di http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Frontend gagal dijalankan.", error);
    process.exit(1);
  });
