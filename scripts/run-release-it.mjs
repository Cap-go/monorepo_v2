import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageName = process.argv[2];
if (!packageName) {
  console.error('Please provide a package name');
  process.exit(1);
}

const rootDir = join(__dirname, '..');
const packagePath = join(rootDir, 'packages', packageName);
const configPath = join(rootDir, '.release-it.json');

let command = `bun run release-it --pkg=${packagePath}/package.json ${process.argv.slice(3).join(' ')}`;

if (existsSync(configPath)) {
  command += ` --config=${configPath}`;
}

try {
  execSync(command, { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error(`Error executing command: ${command}`);
  console.error(error);
  process.exit(1);
}
