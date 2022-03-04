import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { getGitBranchInfo } from '../lib/gitCommand';
import { RawRepository, RawCommit } from '../types';
/**
 * init cache
 * @returns {Promise<RawRepository | null>}
 */
export async function initialize(): Promise<RawRepository | null> {
  const info = await getGitBranchInfo();
  //initialize
  const rootPath = path.join(os.homedir(), '.gb');
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }
  if (info) {
    const cacheRootPath = path.join(rootPath, info.key);
    if (!fs.existsSync(cacheRootPath)) {
      fs.mkdirSync(cacheRootPath);
    }
    info.cacheRootPath = cacheRootPath;
    info.isCached = fs.existsSync(path.join(cacheRootPath, 'logs'));
  }
  return info;
}
/**
 * set commits cache
 * @param {Array<RawCommit>} commits
 * @returns {void}
 */
export function setCommitsCache(commits: Array<RawCommit>): void {
  const { cacheRootPath } = global.gBranchInfo;
  const cacheFile = path.join(cacheRootPath, 'commits');
  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, JSON.stringify(commits));
  }
}
/**
 * return commits cache
 * @returns {Array<RawCommit>}
 */
export function getCommitsCache(): Array<RawCommit> {
  const { cacheRootPath } = global.gBranchInfo;
  const cacheFile = path.join(cacheRootPath, 'commits');
  if (fs.existsSync(cacheFile)) {
    const content = fs.readFileSync(cacheFile).toString();
    return JSON.parse(content);
  }
  return [];
}
