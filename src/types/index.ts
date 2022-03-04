/**
 * Raw of rank
 */
export type RawRank = {
  name: string;
  key: string;
  additions: number;
  deletions: number;
  commits: number;
};
/**
 * Command
 */
export type Command = {
  name: string;
  options: Array<[string, () => string]>;
  description: () => string;
  action: (_: string, cmd: { [key: string]: any }) => void;
};
/**
 * Commit
 */
export type RawCommit = {
  commit: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  changes: Array<RawFileChange>;
};
/**
 * File change
 */
export type RawFileChange = {
  additions: number;
  deletions: number;
  file: string;
};
/**
 * Line File change
 */
export type RawLineNode = {
  commit: string;
  additions: number;
  deletions: number;
  date: Date;
};
export type RawCacheGitboard = {
  commits: Array<RawCommit>;
  status: RawStatus;
};
export type RawRepository = {
  isCached: boolean;
  branch: string;
  cacheRootPath: string;
  localPath: string;
  remoteUrl: string;
  remoteBranch: string;
  key: string;
};
export type RawStatus = {
  remoteUrl: string;
  remoteBranch: string;
  branch: string;
  firstCommittedAt: Date;
  lastCommittedAt: Date;
  lines: number;
  contributors: number;
  commits: number;
  additions: number;
  deletions: number;
};
