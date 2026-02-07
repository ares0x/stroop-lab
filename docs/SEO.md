# SEO 说明

## 一、全局 Header 与 Footer

- **Header**：已在 `GameLayout` 中全局使用，所有页面（首页、Stroop、舒尔特等）均显示同一 Header。
- **Footer**：已移入 `GameLayout`，作为全局页脚，所有页面均显示同一 Footer，保证整站结构一致。

## 二、已实现的 SEO 内容

### 1. index.html（默认 meta）

- **语言**：`<html lang="zh-Hans">`
- **基础 meta**：charset、viewport、theme-color
- **主 meta**：title、description、keywords、author
- **Open Graph**：og:type、og:site_name、og:title、og:description、og:locale
- **Twitter Card**：twitter:card、twitter:title、twitter:description
- **JSON-LD**：`WebSite` 结构化数据（name、alternateName、description、inLanguage、potentialAction）

### 2. 按路由更新标题与描述

- **`useDocumentMeta(title, description)`**（`src/hooks/common/useDocumentMeta.ts`）：在页面内设置 `document.title` 与 `meta name="description"`，路由切换时更新。
- **使用位置**：
  - 首页：`DEFAULT_TITLE` / `DEFAULT_DESCRIPTION`（来自 `src/config/site.ts`）
  - Stroop：`Stroop 测试 | Cogni` + 对应描述
  - 舒尔特：`舒尔特方格 | Cogni` + 对应描述

### 3. 站点配置（`src/config/site.ts`）

- `SITE_NAME`、`SITE_TAGLINE`、`DEFAULT_TITLE`、`DEFAULT_DESCRIPTION`
- `BASE_URL`：优先使用 `VITE_SITE_BASE_URL`（部署时在 `.env.production` 中设置），否则为 `window.location.origin`（仅浏览器端）
- 用于后续扩展 canonical、og:url 等

### 4. robots.txt（`public/robots.txt`）

- `User-agent: *`、`Allow: /`
- Sitemap 行已注释，部署时取消注释并改为实际站点根 URL

### 5. sitemap.xml（`public/sitemap.xml`）

- 当前为静态模板，包含 `/`、`/stroop`、`/schulte`
- **部署时**：将 `https://cogni.example.com` 全部替换为实际站点根 URL（如 `https://your-domain.com`），并视需要更新 `lastmod`
- 若需按构建时 BASE_URL 生成，可后续用 Vite 插件或构建脚本生成

## 三、部署时建议

1. **设置站点根 URL**：在 `.env.production` 中设置 `VITE_SITE_BASE_URL=https://your-domain.com`（末尾无斜杠），便于将来做 canonical、og:url 等。
2. **robots.txt**：取消 Sitemap 注释并改为 `Sitemap: https://your-domain.com/sitemap.xml`。
3. **sitemap.xml**：将占位域名替换为实际域名，并随新页面上线更新 `<url>` 列表与 `lastmod`。
4. **分享图（可选）**：在 `index.html` 或站点配置中增加 `og:image`、`twitter:image`，指向一张 1200×630 的默认分享图。

## 四、可选增强（后续）

- **Canonical**：在每页或布局中输出 `<link rel="canonical" href="{BASE_URL}{pathname}" />`（SPA 需考虑首屏与爬虫）。
- **服务端渲染（SSR）或预渲染**：对首屏或关键路由做 SSR/预渲染，可进一步改善爬虫抓取与首屏 meta。
- **动态 sitemap**：根据 `REGISTERED_GAMES` 或 CMS 在构建/运行时生成 sitemap。
