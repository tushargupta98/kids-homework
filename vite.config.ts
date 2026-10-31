import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const mdxPlugin = mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] });

// @mdx-js/rollup strips the query before filtering, so `?raw` imports would get compiled too.
// lib/content.ts reads lesson frontmatter from raw text, so skip those.
const rawSafeMdx = {
  ...mdxPlugin,
  enforce: 'pre',
  async transform(value: string, id: string) {
    if (id.includes('?raw')) return null;
    return (await mdxPlugin.transform.call(this, value, id)) ?? null;
  },
} as Plugin;

export default defineConfig({
  plugins: [
    rawSafeMdx,
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  test: {
    environment: 'node',
  },
});
