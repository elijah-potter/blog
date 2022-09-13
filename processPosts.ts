import { unified } from "unified";
import remarkKatex from "rehype-katex";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import fs from "fs/promises";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rust from "highlight.js/lib/languages/rust";
import "highlight.js/styles/default.css";

let rendered: null | Map<string, string> = null;

/// Process each file in `./posts` into HTML and return a map of `filename` -> `html`
export default async function processPosts(): Promise<Map<string, string>> {
  if (rendered === null || true) {
    rendered = new Map();

    try {
      const filenames = await fs.readdir("./posts");

      const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeHighlight, { languages: { rust } })
        .use(remarkKatex)
        .use(rehypeStringify);

      for (const filename of filenames) {
        const contents = await fs.readFile(`./posts/${filename}`, "utf8");

        const vfile = await processor.process(contents);
        const html = vfile.toString();
        rendered.set(filename, html);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return rendered;
}
