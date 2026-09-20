import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function runPrisma(args) {
  const prismaCli = fileURLToPath(
    new URL('../node_modules/prisma/build/index.js', import.meta.url),
  );
  const result = spawnSync(process.execPath, [prismaCli, ...args], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.NODE_ENV === 'production') {
  runPrisma(['generate']);
  runPrisma(['migrate', 'deploy']);
  runPrisma(['db', 'seed']);
} else {
  console.log('Skipping production database setup outside NODE_ENV=production.');
}
