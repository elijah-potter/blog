import "dotenv/config";
import { mysqlTable, text, timestamp, int } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const commentsTable = mysqlTable("comments", {
	id: int().autoincrement().primaryKey(),
	post: text().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	message: text().notNull(),
	timestamp: timestamp().notNull().defaultNow(),
});

export type NewComment = typeof commentsTable.$inferInsert;
export type Comment = typeof commentsTable.$inferSelect;
export const CommentSchema = createSelectSchema(commentsTable);
export const NewCommentSchema = createInsertSchema(commentsTable);
