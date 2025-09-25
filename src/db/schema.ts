import "dotenv/config";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

function sqliteTimestamp() {
	return text("timestamp").notNull().default(sql`(current_timestamp)`);
}

export const commentsTable = sqliteTable("comments", {
	id: int().primaryKey(),
	post: text().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	timestamp: sqliteTimestamp(),
});

export type NewComment = typeof commentsTable.$inferInsert;
export type Comment = typeof commentsTable.$inferSelect;
export const CommentSchema = createSelectSchema(commentsTable);
export const NewCommentSchema = createInsertSchema(commentsTable);
