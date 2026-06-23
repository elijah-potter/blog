export function articleIdToSlug(articleId: string): string {
	return encodeURIComponent(articleId.replaceAll("_", "-"));
}
