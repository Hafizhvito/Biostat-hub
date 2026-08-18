/**
 * Entry point backend Riset Hub.
 * Menjalankan server Express di port dari env (default 3001).
 */

import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`API berjalan di http://localhost:${env.port}`);
});