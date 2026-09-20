import { spawnSync } from 'node:child_process';

if (process.env.NODE_ENV === 'production') {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    throw new Error('npm_execpath is unavailable during production install.');
  }

  const result = spawnSync(process.execPath, [npmCli, 'run', 'build'], {
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
