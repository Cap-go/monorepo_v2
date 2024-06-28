// scripts/ios.ts
import { versionBetaToCode, versionCodeToCodeBeta, versionPureToCode } from './utils.ts';

const regexM = /MARKETING_VERSION = (.*);\n/g;
const regexC = /CURRENT_PROJECT_VERSION = (.*);\n/g;

export function readVersion(contents: string): string | null {
  const vString = contents.match(regexM);
  console.log('vString', vString);
  const version = vString && vString[0] ? vString[0].replace(regexM, '$1') : null;
  return version;
}

export function writeVersion(contents: string, version: string): string {
  const [versionPure, versionBeta] = version.split('-');
  const newContent = contents.replace(regexM, `MARKETING_VERSION = ${versionPure};\n`);
  let versionCode = versionPureToCode(versionPure);
  let versionCodeBeta = versionBetaToCode(versionBeta);
  const versionCodeFinal = versionCodeToCodeBeta(versionCode, versionCodeBeta);
  const finalContent = newContent.replace(
    regexC,
    `CURRENT_PROJECT_VERSION = ${versionCodeFinal};\n`
  );
  return finalContent;
}
