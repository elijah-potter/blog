/**
 * Server-only slug lookup.
 *
 * This module reads post declarations from the filesystem, so it must only be
 * imported from server-side code. Do not import it from client components or
 * any module that is bundled for the browser.
 */
import { getPostDeclarations } from "./postDeclarations";

export async function slugToArticleId(
	slug: string,
): Promise<string | undefined> {
	const posts = await getPostDeclarations();
	const articleIds = Object.keys(posts);

	const shortened = articleIds.map((id) =>
		id.replaceAll("_", "").replaceAll("-", ""),
	);
	const shortedSlug = slug.replaceAll("_", "").replaceAll("-", "");

	const match = shortened.findIndex((s) => s == shortedSlug);

	return articleIds[match];
}
