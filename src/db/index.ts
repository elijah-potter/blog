import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

export const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
migrate(db, {
	migrationsFolder: "./drizzle",
	migrationsTable: "__drizzle_migrations",
});
