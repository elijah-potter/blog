import { startCase } from "lodash";
import posts from "./posts/articles";
import fs from "fs";

function generateItems(): string[] {
  return Object.entries(posts).map(
    ([name, post]) =>
      `<item>
  <title>${startCase(name)}</title>
  <description>${post.description}</description>
  <guid isPermaLink="false">${name}</guid>
  <link>https://elijahpotter.dev/articles/${name}</link>
</item>
  `
  );
}

fs.writeFileSync(
  "./public/rss.xml",
  `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="https://elijahpotter.dev/rss.xml" rel="self" type="application/rss+xml" />
<title>Elijah Potter</title>
<description>The writings of Elijah Potter</description>
<link>https://elijahpotter.dev</link>
<copyright>2023 elijahpotter.dev All rights reserved</copyright>
<ttl>60</ttl>

${generateItems().reduce((a, b) => `${a}\n${b}`)}

</channel>
</rss>
    `
);
