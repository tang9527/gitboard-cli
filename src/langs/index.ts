import ENI18N from './en-US';
import ZHI18N from './zh-CN';
const i18N = {
  'en-US': ENI18N,
  'zh-CN': ZHI18N,
} as any;
/**
 * get i18n text
 * @param {string} key
 * @returns {string}
 */
export function getText(key: string): string {
  const lang = global.gLang === 'zh_CN.UTF-8' ? 'zh-CN' : 'en-US';
  return i18N[lang][key] || '';
}
