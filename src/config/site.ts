/**
 * 站点与 SEO 配置
 * 部署时可通过环境变量 VITE_SITE_BASE_URL 覆盖站点根 URL（用于 canonical、sitemap、og:url）
 */
export const SITE_NAME = 'Cogni';
export const SITE_TAGLINE = '脑力训练平台';
export const DEFAULT_TITLE = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  'Cogni 是脑力与认知训练平台，提供 Stroop 测试、舒尔特方格等科学训练项目，每日几分钟提升专注力、反应力与记忆。';

/** 站点根 URL，末尾无斜杠。部署时设置 VITE_SITE_BASE_URL */
export const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_BASE_URL) ||
  (typeof window !== 'undefined' ? window.location.origin : '') ||
  '';

export const DEFAULT_OG_IMAGE = ''; // 可选：默认分享图 URL
