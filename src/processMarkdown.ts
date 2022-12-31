import { unified } from "unified";
import remarkKatex from "rehype-katex";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rust from "highlight.js/lib/languages/rust";
import bash from "highlight.js/lib/languages/bash";
import fs from "fs/promises";

/// Converts `markdown` to `html`
export async function processMarkdown(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { languages: { rust, bash } })
    .use(remarkKatex)
    .use(rehypeStringify);

  const vfile = await processor.process(markdown);
  const html = vfile.toString();

  return html;
}

export async function processMarkdownFile(filename: string) {
  const raw_markdown = await fs.readFile(filename, "utf8");
  return processMarkdown(raw_markdown);
}