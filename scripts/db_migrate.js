const { spawn } = require('child_process');

function runCmd(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${cmd} ${args.join(' ')}`);
    const proc = spawn(cmd, args, {
      shell: true,
      env: process.env,
    });

    proc.stdout.on('data', (d) => process.stdout.write(d.toString()));
    proc.stderr.on('data', (d) => process.stderr.write(d.toString()));

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function main() {
  try {
    console.log('--- Generating Prisma Client ---');
    await runCmd('npx', ['prisma', 'generate']);

    console.log('--- Seeding Data ---');
    await runCmd('npx', ['tsx', 'prisma/seed.ts']);

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
