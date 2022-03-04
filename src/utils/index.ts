import * as numeral from 'numeral';
/**
 * format number
 * @param {number} current
 * @returns {string}
 */
export function formatNumber(current: number): string {
  return numeral(current).format('0,0');
}
