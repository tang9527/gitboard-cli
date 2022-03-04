import { exec } from 'child_process';
import { RawRepository } from '../types';
const MD5 = require('md5.js');
/**
 * return git repository's remote url
 * @returns {Promise<RawRepository|null>}
 */
export async function getGitBranchInfo(): Promise<RawRepository | null> {
  /**
   * execute simple command
   * @param {string} cmd --command
   * @returns {Promise<string>} --stdout
   */
  const execGitCommand = (cmd: string): Promise<string> => {
    return new Promise((resolve) => {
      exec(cmd, (error, stdout, _) => {
        if (error) {
          resolve('');
        } else {
          resolve(stdout.substring(0, stdout.length - 1));
        }
      });
    });
  };
  const remoteOriginUrl = await execGitCommand(
    'git config --get remote.origin.url'
  );
  if (!remoteOriginUrl) {
    return null;
  }
  const currentBranch = await execGitCommand('git branch --show-current');
  if (!currentBranch) {
    return null;
  }
  const info: RawRepository = {
    isCached: false,
    localPath: process.cwd(),
    remoteUrl: remoteOriginUrl,
    branch: currentBranch,
    remoteBranch: '',
    key: '',
    cacheRootPath: '',
  };
  const stdout = await execGitCommand('git config --list');
  const config = {} as any;
  stdout.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    config[key] = value;
  });
  const remote = config[`branch.${currentBranch}.remote`];
  const mergeInfo = config[`branch.${currentBranch}.merge`].split('/');
  const merge = mergeInfo[mergeInfo.length - 1];
  const remoteBranch = `${remote}/${merge}`;
  info.remoteBranch = remoteBranch;
  info.key = new MD5().update(info.remoteUrl + info.remoteBranch).digest('hex');
  return info;
}
