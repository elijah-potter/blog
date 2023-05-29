import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://elijahpotter.dev",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    build: {
      sourcemap: "inline",
    },
    plugins: [wasm(), topLevelAwait()],
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
