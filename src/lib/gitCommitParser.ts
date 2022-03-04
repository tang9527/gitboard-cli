import { spawn } from 'child_process';
import * as dayjs from 'dayjs';
import * as readline from 'readline';
import * as loading from 'loading-cli';
import { RawCommit, RawFileChange } from '../types';
import { getCommitsCache, setCommitsCache } from './cache';
import { getText } from '../langs';
require('colors-cli/toxic');
/**
 * render loading and start
 * @returns {loading.Loading}
 */
function renderLoading(): loading.Loading {
  return loading({
    text: global.gBranchInfo.isCached
      ? (getText('WAITING') as any).green
      : (getText('LONG_WAITING') as any).green,
    color: 'yellow',
    interval: 100,
    stream: process.stdout,
    frames: [
      '🕐 ',
      '🕑 ',
      '🕒 ',
      '🕓 ',
      '🕔 ',
      '🕕 ',
      '🕖 ',
      '🕗 ',
      '🕘 ',
      '🕙 ',
      '🕚 ',
    ],
  }).start();
}
let blockLines: Array<string> = [];
/**
 * parse block lines
 * @param {string} line
 * @param {(commit:RawCommit)=>void} callback
 * @returns {void}
 */
function parseBlockLines(
  line: string,
  callback: (commit: RawCommit) => void
): void {
  const commitReg = /commit ([a-z0-9]{40})$/;
  const ok = commitReg.test(line);
  if (ok) {
    if (blockLines.length > 0) {
      const commit = parseCommit(blockLines);
      callback(commit);
    }
    blockLines = [];
    blockLines.push(line);
  } else {
    blockLines.push(line);
  }
}
/**
 * parse commit
 * @param {string[]} lines
 * @returns {LogCommit}
 */
function parseCommit(lines: Array<string>): RawCommit {
  const commitReg = /commit ([a-z0-9]{40})$/;
  const authorReg = /Author: (.*)$/;
  const dateReg = /Date: (.*)$/;
  const commit: RawCommit = {} as any;
  const messages: Array<string> = [];
  const changes: Array<RawFileChange> = [];
  let emptyShowTimes = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') {
      emptyShowTimes++;
    }
    //parser commit
    const isCommit = commitReg.test(line);
    if (isCommit) {
      commit.commit = commitReg.exec(line)[1].trim();
    } else {
      //parse author
      const isAuthor = authorReg.test(line);
      if (isAuthor) {
        const author = authorReg.exec(line)[1].trim();
        const emailReg = /(?:"?([^"]*)"?\s)?(?:<?(.+[^>]+)>?)/;
        const info = emailReg.exec(author);
        commit.author = info[1]; //author
        commit.email = info[2]; //email
      } else {
        //parse date
        const isDate = dateReg.test(line);
        if (isDate) {
          const date = dateReg.exec(line)[1].trim();
          commit.date = new Date(date);
        } else {
          //parse messages
          if (emptyShowTimes === 1 && line) {
            messages.push(line.trim());
          }
          //parse changes
          if (emptyShowTimes === 2 && line) {
            const noTxtReg = /-\t-\t(.*)$/;
            if (!noTxtReg.test(line)) {
              const changeReg = /([0-9]+)\t([0-9]+)\t(.*)$/;
              const info = changeReg.exec(line);
              if (info.length === 4) {
                const additions = parseInt(info[1], 10);
                const deletions = parseInt(info[2], 10);
                const file = info[3];
                changes.push({
                  additions,
                  deletions,
                  file,
                });
              }
            } else {
              //image or other file
              const info = noTxtReg.exec(line);
              changes.push({
                additions: 0,
                deletions: 0,
                file: info[1],
              });
            }
          }
        }
      }
    }
  }
  commit.message = messages.join('\n');
  commit.changes = changes;
  return commit;
}
export default function gitCommitParser(): Promise<Array<RawCommit>> {
  let changed = false;
  //loading animation
  const load = renderLoading();
  let commits = getCommitsCache();
  commits = commits.map((commit) => {
    commit.date = new Date(commit.date);
    return { ...commit };
  });
  const params = ['--date=iso', '--numstat'];
  if (commits.length > 0) {
    //delta read logs
    const last = dayjs(commits[0].date).add(1, 'second').toDate();
    params.push(`--since='${dayjs(last).format()}'`);
  }
  const sp = spawn('git', ['log', ...params], {
    cwd: global.gBranchInfo.localPath,
  });
  const rl = readline.createInterface({
    input: sp.stdout,
  });
  return new Promise((resolve) => {
    rl.on('line', function (line) {
      parseBlockLines(line, (commit) => {
        commits.push(commit);
        changed = true;
      });
    }).on('close', function () {
      //last block
      if (blockLines.length > 0) {
        const commit = parseCommit(blockLines);
        commits.push(commit);
        changed = true;
      }
      //cache commits
      if (changed) {
        setCommitsCache(commits);
      }
      load.stop();
      resolve(commits);
    });
  });
}
