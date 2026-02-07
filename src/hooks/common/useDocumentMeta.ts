import { useEffect } from 'react';

/**
 * 设置当前页的 document.title 与 meta description（用于 SEO 与分享）
 * 在页面组件内调用，路由切换时会更新。
 */
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let metaEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevContent = metaEl?.getAttribute('content') ?? '';
    if (description) {
      if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'description');
        document.head.appendChild(metaEl);
      }
      metaEl.setAttribute('content', description);
    }

    return () => {
      document.title = prevTitle;
      if (metaEl && description) {
        metaEl.setAttribute('content', prevContent);
      }
    };
  }, [title, description]);
}
