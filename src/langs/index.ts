import ENI18N from './en-US';
import ZHI18N from './zh-CN';
const i18N = {
  'en-US': ENI18N,
  'zh-CN': ZHI18N,
} as any;
/**
 * get i18n text
 * @param {string} key
 * @param { { [key: string]: string | number }} parameters
 * @returns {string}
 */
export function getText(
  key: string,
  parameters?: { [key: string]: string | number }
): string {
  const lang = global.gLang === 'zh_CN.UTF-8' ? 'zh-CN' : 'en-US';
  let value = i18N[lang][key] || '';
  if (parameters) {
    Object.keys(parameters).forEach((key) => {
      const itemValue = parameters[key];
      value = value.replaceAll('${' + key + '}', itemValue);
    });
  }
  return value;
}
