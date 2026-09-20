import { spawnSync } from 'node:child_process';

if (process.env.NODE_ENV === 'production') {
  const result = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: process.env,
    shell: true,
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
