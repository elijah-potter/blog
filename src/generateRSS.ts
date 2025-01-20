import { startCase } from "lodash";
import { generatePartialPosts, PartialPost } from "../posts/articles";
import fs from "fs/promises";

async function generateItems(
  posts: Record<string, PartialPost>,
): Promise<string[]> {
  const output = [];

  for (const entry of Object.entries(posts)) {
    const [name, post] = entry;
    let enclosureString = "";

    if (post.image != null) {
      const image = await fs.readFile(`./public${post.image}`);
      enclosureString = `<enclosure url="https://elijahpotter.dev/${
        post.image
      }" length="${image.byteLength}" type="${getMimeType(post.image)}"/>`;
    }

    output.push(`<item>
  <title>${startCase(name)}</title>
  <description>${post.description}</description>
  <guid isPermaLink="false">${name}</guid>
  <link>https://elijahpotter.dev/articles/${name}</link>
  <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
  ${enclosureString}
</item>
  `);
  }

  return output;
}

function getMimeType(imagePath: string): string {
  if (imagePath.endsWith("webp")) {
    return "image/webp";
  }
  if (imagePath.endsWith("png")) {
    return "image/png";
  } else if (imagePath.endsWith("jpg") || imagePath.endsWith("jpeg")) {
    return "image/jpeg";
  } else {
    throw new Error("Unexpected file type");
  }
}

export default async function generateRSS(): Promise<string> {
  const posts = await generatePartialPosts();

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="https://elijahpotter.dev/rss.xml" rel="self" type="application/rss+xml" />
<title>Elijah Potter</title>
<description>The writings of Elijah Potter</description>
<link>https://elijahpotter.dev</link>
<copyright>2023 elijahpotter.dev All rights reserved</copyright>
<ttl>60</ttl>

${(await generateItems(posts)).reduce((a, b) => `${a}\n${b}`)}

</channel>
</rss>
    `;
}
