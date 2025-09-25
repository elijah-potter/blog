import { db } from ".";
import { commentsTable, NewComment, Comment } from "./schema";
import { eq } from "drizzle-orm";

export async function insertComment(comment: NewComment): Promise<void> {
	await db.insert(commentsTable).values(comment);
}

export async function getCommentsForPost(slug: string): Promise<Comment[]> {
	return await db
		.select()
		.from(commentsTable)
		.where(eq(commentsTable.post, slug));
}
