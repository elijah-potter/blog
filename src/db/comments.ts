import { db } from ".";
import { commentsTable, NewComment, Comment } from "./schema";
import { desc, eq } from "drizzle-orm";

export async function insertComment(comment: NewComment): Promise<void> {
	await db.insert(commentsTable).values(comment);
}

export async function getCommentsForPost(postSlug: string): Promise<Comment[]> {
	return await db
		.select()
		.from(commentsTable)
		.where(eq(commentsTable.post, postSlug));
}

export async function getCommentFromId(
	id: number,
): Promise<Comment | undefined> {
	return (
		await db.select().from(commentsTable).where(eq(commentsTable.id, id))
	)[0];
}

export async function deleteComment(id: number): Promise<void> {
	await db.delete(commentsTable).where(eq(commentsTable.id, id));
}

export async function getRecentComments(limit: number): Promise<Comment[]> {
	return await db
		.select()
		.from(commentsTable)
		.orderBy(desc(commentsTable.timestamp))
		.limit(limit);
}
