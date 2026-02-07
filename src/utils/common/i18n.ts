import { useCallback, useState } from 'react';
import { zhCN } from '../../i18n/zh-CN';

export type Locale = 'zh-CN';

const translations: Record<Locale, typeof zhCN> = {
  'zh-CN': zhCN,
};

let currentLocale: Locale = 'zh-CN';

/**
 * 设置当前语言（预留多语言切换）
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * 获取当前语言
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * 根据 locale 获取翻译对象
 */
export function getTranslations(locale: Locale = currentLocale) {
  return translations[locale] ?? zhCN;
}

/**
 * 根据键路径获取文案，支持占位符 {name}
 * @example t('game.totalPlays', { count: 5 }) => '共玩 5 次'
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  locale: Locale = currentLocale
): string {
  const parts = key.split('.');
  let value: unknown = getTranslations(locale);
  for (const part of parts) {
    value = value && typeof value === 'object' && part in value ? (value as Record<string, unknown>)[part] : undefined;
  }
  const str = typeof value === 'string' ? value : key;
  if (!params) return str;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    str
  );
}

/**
 * 国际化 Hook：返回 t 与当前 locale，满足 Requirements 14.3
 * 切换语言后组件会重新渲染
 */
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(currentLocale);
  const setLocale = useCallback((l: Locale) => {
    currentLocale = l;
    setLocaleState(l);
  }, []);
  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => t(key, params, locale),
    [locale]
  );
  return { t: translate, locale, setLocale };
}
