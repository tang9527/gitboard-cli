import { RawRank, Command } from '../types';
import { getText } from '../langs';
import { formatNumber } from '../utils';
import { getCommitRanks } from '../lib/gitCommitReducer';
import gitCommitParser from '../lib/gitCommitParser';

async function handler(_: string, cmd: { [key: string]: any }) {
  const options = cmd._optionValues;
  options.top = options.top || 10;
  const { before, after, top } = options;

  const commits = await gitCommitParser();
  const [reduceCommits, ranks] = await getCommitRanks(commits, after, before);
  const additions = ranks.reduce((sum, current) => {
    return sum + current.additions;
  }, 0);
  const deletions = ranks.reduce((sum, current) => {
    return sum + current.deletions;
  }, 0);

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
    label: `Top ${top}`,
    columnSpacing: 2,
    columnWidth: [10, 30, 15, 20, 15, 20, 15, 20],
  });
  const calculatePercent = (current: number, total: number): string => {
    return `${(current / total).toFixed(3)}%`;
  };
  //Calculate the contribution percentage
  const data = ranks.map((item: RawRank, index: number) => {
    return [
      index + 1,
      item.name,
      formatNumber(item.commits),
      calculatePercent(item.commits, reduceCommits.length),
      formatNumber(item.additions),
      calculatePercent(item.additions, additions),
      formatNumber(item.deletions),
      calculatePercent(item.deletions, deletions),
    ];
  });
  table.setData({
    headers: [
      'Top',
      'Name',
      'Commits',
      'Commits percent',
      'Additions',
      'Additions percent',
      'Deletions',
      'Deletions percent',
    ],
    data: data.slice(0, top),
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
  name: 'rank',
  options: [
    [
      '-t, --top <number>',
      () => {
        return getText('RANK_T_DESCRIPTION');
      },
    ],
    [
      '-a, --after <date>',
      () => {
        return getText('RANK_SINCE_DESCRIPTION');
      },
    ],
    [
      '-b, --before <date>',
      () => {
        return getText('RANK_UNTIL_DESCRIPTION');
      },
    ],
  ],
  description: (): string => {
    return getText('RANK_DESCRIPTION');
  },
  action: handler,
} as Command;
