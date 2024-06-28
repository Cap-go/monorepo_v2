// scripts/release-it-plugins/android-version-plugin.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { writeVersion } from '../android';

class AndroidVersionPlugin {
  bump(version: string): void {
    const filePath = resolve(process.cwd(), 'android/app/build.gradle');
    const contents = readFileSync(filePath, 'utf8');
    const updatedContents = writeVersion(contents, version);
    writeFileSync(filePath, updatedContents);
  }
}

export default AndroidVersionPlugin;
