import { unified } from "unified";
import remarkKatex from "rehype-katex";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rust from "highlight.js/lib/languages/rust";
import bash from "highlight.js/lib/languages/bash";
// TODO:
import "highlight.js/styles/default.css";

/// Converts `markdown` to `html`
export default async function processMarkdown(
  markdown: string
): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeHighlight, { languages: { rust, bash } })
    .use(remarkKatex)
    .use(rehypeStringify);

  const vfile = await processor.process(markdown);
  const html = vfile.toString();

  return html;
}
