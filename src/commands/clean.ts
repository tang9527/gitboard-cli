import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Command } from '../types';
import { getText } from '../langs';
require('colors-cli/toxic');

async function handler() {
  const rootPath = path.join(os.homedir(), '.gb');
  const rmDir = () => {
    return new Promise((resolve) => {
      if (fs.existsSync(rootPath)) {
        fs.rm(rootPath, { recursive: true }, () => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  };
  rmDir().then(() => {
    console.log((getText('CLEAN_TIP') as any).green);
  });
}
export default {
  name: 'clean',
  options: [],
  description: (): string => {
    return getText('CLEAN_DESCRIPTION');
  },
  action: handler,
} as Command;
