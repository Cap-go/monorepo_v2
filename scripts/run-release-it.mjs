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

const rootDir = path.join(__dirname, '..');
const packagePath = path.join(rootDir, 'packages', packageName);

const command = `npx release-it --config=${rootDir}/.release-it.json --pkg=${packagePath}/package.json ${process.argv.slice(3).join(' ')}`;

try {
  execSync(command, { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error(`Error executing command: ${command}`);
  console.error(error);
  process.exit(1);
}
