import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageName = process.argv[2];
if (!packageName) {
  console.error('Please provide a package name');
  process.exit(1);
}

const packagePath = path.join(__dirname, '..', 'packages', packageName);
const command = `cd ${packagePath} && bun run release-it ${process.argv.slice(3).join(' ')}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(`Error executing command: ${command}`);
  console.error(error);
  process.exit(1);
}
