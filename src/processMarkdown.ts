import { unified } from "unified";
import remarkKatex from "rehype-katex";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rust from "highlight.js/lib/languages/rust";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import fs from "fs/promises";
import rehypeTitleFigure from "rehype-title-figure";
// @ts-expect-error there are no typing for this package.
import typeset from "typeset";

/// Converts `markdown` to `html`
export async function processMarkdown(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { languages: { rust, bash, javascript } })
    .use(remarkKatex)
    .use(rehypeTitleFigure)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const vfile = await processor.process(markdown);
  const html = vfile.toString();

  return typeset(html);
}

export async function processMarkdownFile(filePath: string): Promise<string> {
  const file = await fs.readFile(filePath, "utf8");
  return processMarkdown(file);
}
