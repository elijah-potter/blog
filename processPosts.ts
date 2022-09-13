import { unified } from "unified";
import remarkKatex from "rehype-katex";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import fs from "fs/promises";
import remarkMath from "remark-math";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rust from "highlight.js/lib/languages/rust";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/default.css";

let rendered: null | Map<string, string> = null;

/// Process each file in `./posts` into HTML and return a map of `filename` -> `html`
export default async function processPosts(): Promise<Map<string, string>> {
  if (rendered === null) {
    rendered = new Map();

    try {
      const filenames = await fs.readdir("./posts");

      const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeHighlight, { languages: { rust, bash } })
        .use(remarkKatex)
        .use(rehypeStringify);

      for (const filename of filenames) {
        const contents = await fs.readFile(`./posts/${filename}`, "utf8");

        const vfile = await processor.process(contents);
        const html = vfile.toString();

        let readableName;
        if (filename.endsWith(".md")) {
          readableName = filename.slice(0, filename.length - 3);
        } else {
          readableName = filename;
        }

        rendered.set(readableName, html);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return rendered;
}
