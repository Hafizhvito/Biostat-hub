import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

const requiredBuildFiles = [".next/BUILD_ID", ".next/prerender-manifest.json"];

function addPathToHash(hash, target) {
  if (!existsSync(target)) return;
  const entries = readdirSync(target, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = `${target}/${entry.name}`;
    if (entry.isDirectory()) addPathToHash(hash, child);
    else {
      hash.update(child);
      hash.update(readFileSync(child));
    }
  }
}

const sourceHash = createHash("sha256");
addPathToHash(sourceHash, "src");
addPathToHash(sourceHash, "public");
for (const file of ["package.json", "next.config.ts", "tsconfig.json"]) {
  if (existsSync(file)) sourceHash.update(readFileSync(file));
}
const currentSourceHash = sourceHash.digest("hex");
const storedSourceHash = existsSync(".next/source-hash")
  ? readFileSync(".next/source-hash", "utf8").trim()
  : "";
const buildIsStale = currentSourceHash !== storedSourceHash;

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

  writeFileSync(".next/source-hash", currentSourceHash);
}

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((request, response) => {
      return handle(request, response);
    }).listen(port, hostname, () => {
      console.log(`Frontend berjalan di http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error("Frontend gagal dijalankan.", error);
    process.exit(1);
  });
