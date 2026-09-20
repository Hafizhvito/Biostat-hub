import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

if (process.env.NODE_ENV === 'production') {
  const require = createRequire(import.meta.url);
  const nextCli = require.resolve('next/dist/bin/next');
  const result = spawnSync(process.execPath, [nextCli, 'build'], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} else {
  console.log('Skipping production frontend build outside NODE_ENV=production.');
}
