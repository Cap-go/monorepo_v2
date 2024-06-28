// scripts/release-it-plugins/ios-version-plugin.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { writeVersion } from '../ios';

class IOSVersionPlugin {
  bump(version: string): void {
    const filePath = resolve(process.cwd(), 'ios/App/App.xcodeproj/project.pbxproj');
    const contents = readFileSync(filePath, 'utf8');
    const updatedContents = writeVersion(contents, version);
    writeFileSync(filePath, updatedContents);
  }
}


export default IOSVersionPlugin;
