export function articleIdToSlug(articleId: string): string {
	return articleId.replaceAll("_", "-");
}
