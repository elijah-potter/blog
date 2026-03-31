import { db } from ".";
import { commentsTable, NewComment, Comment } from "./schema";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";

export async function insertComment(comment: NewComment): Promise<void> {
	await db.insert(commentsTable).values(comment);
}

export async function getCommentsForPost(postSlug: string): Promise<Comment[]> {
	return await db
		.select()
		.from(commentsTable)
		.where(
			and(eq(commentsTable.post, postSlug), isNull(commentsTable.deleted)),
		);
}

export async function getCommentFromId(
	id: number,
): Promise<Comment | undefined> {
	return (
		await db
			.select()
			.from(commentsTable)
			.where(and(eq(commentsTable.id, id), isNull(commentsTable.deleted)))
	)[0];
}

/** Performs a soft delete by setting the delete timestamp to now. */
export async function deleteComment(id: number): Promise<void> {
	await db
		.update(commentsTable)
		.set({ deleted: new Date() })
		.where(and(eq(commentsTable.id, id), isNull(commentsTable.deleted)));
}

export async function getRecentComments(limit: number): Promise<Comment[]> {
	return await db
		.select()
		.from(commentsTable)
		.orderBy(desc(commentsTable.timestamp))
		.where(isNull(commentsTable.deleted))
		.limit(limit);
}
