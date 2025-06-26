import { generateFullPosts } from "../posts/articles";
import { Feed } from "feed";

export default async function generateRSS(): Promise<string> {
	const feed = new Feed({
		title: "Elijah Potter's Blog",
		description: "The writings of Elijah Potter",
		link: "https://elijahpotter.dev",
		id: "https://elijahpotter.dev",
		copyright: "All rights reserved 2025, Elijah Potter",
		ttl: 60,
		feedLinks: {
			atom: "https://elijahpotter.dev/rss.xml",
		},
	});

	const posts = await generateFullPosts();

	for (const [key, post] of Object.entries(posts)) {
		const link = `https://elijahpotter.dev/articles/${key}`;

		feed.addItem({
			title: post.title,
			image: post.image ?? undefined,
			id: link,
			description: post.content_html,
			content: post.content_html,
			date: new Date(post.pubDate),
			link: link,
		});
	}

	return feed.rss2();
}
