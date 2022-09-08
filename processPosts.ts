import { remark } from "remark";
import remarkHtml from "remark-html";
import fs from "fs/promises";

let rendered: null | Map<string, string> = null;

/// Process each file in `./posts` into HTML and return a map of `filename` -> `html`
export default async function processPosts(): Promise<Map<string, string>> {
  if (rendered === null) {
    rendered = new Map();

    try {
      const filenames = await fs.readdir("./posts");

      const processor = remark().use(remarkHtml);

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
