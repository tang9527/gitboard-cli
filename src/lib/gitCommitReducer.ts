import * as dayjs from 'dayjs';
import { RawCommit, RawRank, RawStatus } from '../types';
/**
 * reduce ranks
 * @param {Array<RawCommit>} commits
 * @param {Date} after
 * @param {Date} before
 * @returns {Promise<[Array<RawCommit>, Array<RawRank>]>}
 */
export async function getCommitRanks(
  commits: Array<RawCommit>,
  after?: Date,
  before?: Date
): Promise<[Array<RawCommit>, Array<RawRank>]> {
  if (after) {
    after = dayjs(
      dayjs(new Date(after)).format('YYYY-MM-DD 00:00:00'),
      'YYYY-MM-DD HH:mm:ss'
    ).toDate();
  }
  if (before) {
    before = dayjs(
      dayjs(new Date(before)).format('YYYY-MM-DD 23:59:59'),
      'YYYY-MM-DD HH:mm:ss'
    ).toDate();
  }

  const reduceCommits =
    !after && !before
      ? commits
      : commits.filter((commit) => {
          const { date } = commit;
          if (!date) {
            return false;
          }
          if (after && before) {
            if (
              date.getTime() >= after.getTime() &&
              date.getTime() <= before.getTime()
            ) {
              return true;
            }
            return false;
          }
          if (after) {
            if (date.getTime() >= after.getTime()) {
              return true;
            }
            return false;
          }
          if (before) {
            if (date.getTime() <= before.getTime()) {
              return true;
            }
            return false;
          }
          return true;
        });
  const rankMap: { [key: string]: RawRank } = {};
  reduceCommits.forEach((commit) => {
    const { author, email, date, changes } = commit;
    const key = `${author}<${email}>`;
    const rank = rankMap[key];
    const currentAdditions = rank ? rank['additions'] : 0;
    const currentDeletions = rank ? rank['deletions'] : 0;
    const currentCommits = rank ? rank['commits'] : 0;
    const additions = changes.reduce((sum, current) => {
      return sum + current.additions;
    }, 0);
    const deletions = changes.reduce((sum, current) => {
      return sum + current.deletions;
    }, 0);
    rankMap[key] = {
      name: author,
      key,
      additions: currentAdditions + additions,
      deletions: currentDeletions + deletions,
      commits: currentCommits + 1,
    };
  });
  const ranks = Object.values(rankMap).sort((a, b) => {
    const v1 = a.additions + a.deletions;
    const v2 = b.additions + b.deletions;
    if (v1 > v2) {
      return -1;
    } else if (v1 < v2) {
      return 1;
    }
    return 0;
  });
  return [reduceCommits, ranks];
}
/**
 * reduce repository's status
 * @param {Array<RawCommit>} commits
 * @returns {Promise<RawStatus>}
 */
export async function getRepositoryStatus(
  commits: Array<RawCommit>
): Promise<RawStatus> {
  let lastCommittedAt = null as any;
  let firstCommittedAt = null as any;
  if (commits.length > 0) {
    lastCommittedAt = commits[0].date;
    firstCommittedAt = commits[commits.length - 1].date;
  }
  const { remoteUrl, remoteBranch, branch } = global.gBranchInfo;
  let additions = 0;
  let deletions = 0;
  const contributors = {} as any;
  for (let i = 0; i < commits.length; i++) {
    const { changes, author, email } = commits[i];
    const subAdditions = changes.reduce((sum, current) => {
      return sum + current.additions;
    }, 0);
    const subDeletions = changes.reduce((sum, current) => {
      return sum + current.deletions;
    }, 0);
    additions += subAdditions;
    deletions += subDeletions;
    const key = `${author}<${email}>`;
    contributors[key] = true;
  }
  const status: RawStatus = {
    remoteUrl,
    remoteBranch,
    branch,
    lastCommittedAt,
    firstCommittedAt,
    commits: commits.length,
    additions,
    deletions,
    lines: additions - deletions,
    contributors: Object.keys(contributors).length,
  };
  return status;
}
