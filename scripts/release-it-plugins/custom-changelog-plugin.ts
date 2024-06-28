// scripts/release-it-plugins/gpt-changelog-plugin.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import OpenAI from 'openai';

const execAsync = promisify(exec);

class GPTChangelogPlugin {
  readonly pluginName = 'gpt-changelog-plugin';
  private openai: OpenAI;
  private maxEntries: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.maxEntries = 20; // Default to 20, can be made configurable
  }

  async beforeRelease(): Promise<void> {
    const { changelog } = await this.getChangelog();
    const improvedChangelog = await this.improveChangelogWithGPT(changelog);
    const limitedChangelog = this.limitChangelogEntries(improvedChangelog);
    this.writeChangelog(limitedChangelog);
  }

  private async getChangelog(): Promise<{ changelog: string }> {
    const filePath = resolve(process.cwd(), 'CHANGELOG.md');
    return { changelog: readFileSync(filePath, 'utf8') };
  }

  private async improveChangelogWithGPT(changelog: string): Promise<string> {
    const commitMessages = await this.getCommitMessages();
    const gitDiff = await this.getGitDiff();

    const prompt = `Improve the following changelog based on the commit messages and git diff:

Changelog:
${changelog}

Commit Messages:
${commitMessages}

Git Diff:
${gitDiff}

Please provide a more detailed and user-friendly changelog. Focus on the main features, improvements, and bug fixes. Organize the information in a clear and concise manner.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return response.choices[0].message.content || changelog;
  }

  private limitChangelogEntries(changelog: string): string {
    const lines = changelog.split('\n');
    const versions: string[] = [];
    let currentVersion = '';

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentVersion) {
          versions.push(currentVersion);
        }
        currentVersion = line + '\n';
        if (versions.length === this.maxEntries - 1) {
          break;
        }
      } else {
        currentVersion += line + '\n';
      }
    }

    if (currentVersion && versions.length < this.maxEntries) {
      versions.push(currentVersion);
    }

    return versions.join('\n');
  }

  private async getCommitMessages(): Promise<string> {
    const { stdout } = await execAsync('git log --pretty=format:"%s" -n 10');
    return stdout;
  }

  private async getGitDiff(): Promise<string> {
    const { stdout } = await execAsync('git diff HEAD~1 HEAD');
    return stdout;
  }

  private writeChangelog(content: string): void {
    const filePath = resolve(process.cwd(), 'CHANGELOG.md');
    writeFileSync(filePath, content);
  }
}

export default GPTChangelogPlugin;
