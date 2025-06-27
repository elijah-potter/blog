import fs from "fs/promises";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import rust from "highlight.js/lib/languages/rust";
import { LRUCache } from "lru-cache";
import rehypeHighlight from "rehype-highlight";
import remarkKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeTitleFigure from "rehype-title-figure";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
// @ts-expect-error there are no typing for this package.
import typeset from "typeset";
import { unified } from "unified";

const mdCache = new LRUCache<string, string>({ max: 20000 });

export async function processMarkdown(markdown: string): Promise<string> {
	const cached = mdCache.get(markdown);
	if (cached) return cached;
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

	mdCache.set(markdown, html);

	return typeset(html);
}

export async function processMarkdownFile(filePath: string): Promise<string> {
	const file = await fs.readFile(filePath, "utf8");
	return processMarkdown(file);
}
