import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const db = drizzle(process.env.DB_FILE_NAME!);
