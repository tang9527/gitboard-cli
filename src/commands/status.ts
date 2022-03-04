import * as dayjs from 'dayjs';
import { Command } from '../types';
import { getText } from '../langs';
import { formatNumber } from '../utils';
import gitCommitParser from '../lib/gitCommitParser';
import { getCommitRanks, getRepositoryStatus } from '../lib/gitCommitReducer';

async function handler(_: string, cmd: { [key: string]: any }) {
  const options = cmd._optionValues;
  const { before, after } = options;
  const commits = await gitCommitParser();
  const [reduceCommits] = await getCommitRanks(commits, after, before);
  const status = await getRepositoryStatus(reduceCommits);
  const contrib = require('gitboard-cli-blessed-contrib');
  const blessed = require('gitboard-cli-blessed');
  const s = blessed.screen({});
  const grid = new contrib.grid({
    rows: 12,
    cols: 12,
    screen: s,
  });
  const table = grid.set(0, 0, 8, 12, contrib.table, {
    keys: true,
    fg: 'green',
    columnSpacing: 2,
    columnWidth: [15, 60],
  });
  const {
    remoteUrl,
    remoteBranch,
    branch,
    firstCommittedAt,
    lastCommittedAt,
    lines,
    contributors,
    additions,
    deletions,
  } = status;
  const data = [
    ['Remote url', remoteUrl],
    ['Remote branch', remoteBranch],
    ['Branch', branch],
    ['Last commit', dayjs(lastCommittedAt).format()],
    ['First commit', dayjs(firstCommittedAt).format()],
    ['Lines', formatNumber(lines)],
    ['Contributors', formatNumber(contributors)],
    ['Commits', formatNumber(reduceCommits.length)],
    ['Additions', formatNumber(additions)],
    ['Deletions', formatNumber(deletions)],
  ];
  table.setData({
    headers: ['Title', 'Value'],
    data,
  });
  table.focus();
  s.on('resize', () => {
    table.emit('attach');
  });
  s.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });
  s.render();
}
export default {
  name: 'status',
  options: [
    [
      '-a, --after <date>',
      () => {
        return getText('STATUS_SINCE_DESCRIPTION');
      },
    ],
    [
      '-b, --before <date>',
      () => {
        return getText('STATUS_UNTIL_DESCRIPTION');
      },
    ],
  ],
  description: () => {
    return getText('STATUS_DESCRIPTION');
  },
  action: handler,
} as Command;
