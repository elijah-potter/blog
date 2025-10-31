export function articleIdToSlug(articleId: string) {
	return articleId.replaceAll("_", "-");
}

export function slugToArticleId(slug: string) {
	return slug.replaceAll("-", "_");
}
