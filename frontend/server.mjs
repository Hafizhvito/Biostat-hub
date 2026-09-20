import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

if (!existsSync(".next/BUILD_ID")) {
  console.log("Build produksi belum tersedia; menjalankan Next.js build...");
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
