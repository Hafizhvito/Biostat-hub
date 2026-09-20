import { createServer } from "node:http";
import next from "next";

const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;
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
