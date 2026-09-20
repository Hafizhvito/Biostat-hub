import { spawnSync } from 'node:child_process';

function runPrisma(args) {
  const result = spawnSync('npx', ['prisma', ...args], {
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
}

if (process.env.NODE_ENV === 'production') {
  runPrisma(['generate']);
  runPrisma(['migrate', 'deploy']);
  runPrisma(['db', 'seed']);
} else {
  console.log('Skipping production database setup outside NODE_ENV=production.');
}
