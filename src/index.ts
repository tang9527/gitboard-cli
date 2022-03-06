import { program } from 'commander';
import * as color from 'colors-cli';
import { initialize } from './lib/cache';
import rankCommand from './commands/rank';
import statusCommand from './commands/status';
import cleanCommand from './commands/clean';
import { RawRepository } from './types';
import { getText } from './langs';
const config = require('../package.json');

declare global {
  var gBranchInfo: RawRepository;
  var gLang: string;
}
const env = process.env;
global.gLang = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;

initialize().then(async (info) => {
  global.gBranchInfo = info;
  program
    .name('gb')
    .description(getText('DESCRIPTION'))
    .version(config.version);
  const commands = [cleanCommand, rankCommand, statusCommand];
  commands.forEach((subCommand) => {
    const { name, options, description, action } = subCommand;
    const command = program.command(name);
    options.forEach((option) => {
      command.option(option[0], option[1]());
    });
    command.description(description());
    command.action((cmd: string, options: { [key: string]: any }) => {
      if (!info && (name === 'rank' || name === 'status')) {
        console.log(
          color.yellow(getText('WARNING')) + getText('INVALID_REPOSITORY')
        );
        return;
      }
      action(cmd, options);
    });
  });
  program.parse();
});
