import { binaryInlined, LocalLinter } from "harper.js";
import { startCase } from "lodash";
import { getPostDeclarations, type PostDeclaration } from "./articles";

export type PartialPost = {
	title: string;
	description_html: string;
	author: string;
} & PostDeclaration;

export type FullPost = {
	content_html: string;
} & PartialPost;

const linter = new LocalLinter({ binary: binaryInlined });

async function createPartialPost(
	key: string,
	post: PostDeclaration,
): Promise<PartialPost> {
	const { processMarkdown } = await import("../src/processMarkdown");
	post.keywords.push("reddit");

	const [description_html, title] = await Promise.all([
		processMarkdown(post.description),
		linter.toTitleCase(startCase(key)),
	]);

	let image = null;

	if (post.image) {
		image = `https://elijahpotter.dev${post.image}`;
	}

	return { author: "Elijah Potter", title, description_html, ...post, image };
}

export async function generatePartialPosts(): Promise<
	Record<string, PartialPost>
> {
	const partialPosts: Record<string, PartialPost> = {};
	const entries = Object.entries(getPostDeclarations()).sort(
		([, a], [, b]) =>
			new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
	);

	for (const [key, post] of entries) {
		const partialPost = await createPartialPost(key, post);
		partialPosts[key] = partialPost;
	}

	return partialPosts;
}

async function createFullPost(
	key: string,
	post: PartialPost,
): Promise<FullPost> {
	const { processMarkdown } = await import("../src/processMarkdown");
	const fs = await import("fs/promises");

	const fileContent = await fs.readFile(`./posts/${key}.md`, "utf8");
	const content_html = await processMarkdown(fileContent);

	return { content_html, ...post };
}

export async function generateFullPosts(): Promise<Record<string, FullPost>> {
	const pairs = await Promise.all(
		Object.entries(await generatePartialPosts()).map(
			async ([key, post]) => [key, await createFullPost(key, post)] as const,
		),
	);

	return Object.fromEntries(pairs);
}
