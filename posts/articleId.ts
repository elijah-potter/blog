import { getPostDeclarations } from "./articles";

export function articleIdToSlug(articleId: string): string {
	return articleId.replaceAll("_", "-");
}

export function slugToArticleId(slug: string): string {
	const posts = getPostDeclarations();
	const articleIds = Object.keys(posts);

	const shortened = articleIds.map((id) =>
		id.replaceAll("_", "").replaceAll("-", ""),
	);
	const shortedSlug = slug.replaceAll("_", "").replaceAll("-", "");

	const match = shortened.findIndex((s) => s == shortedSlug);

	return articleIds[match];
}
