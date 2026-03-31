import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GitHub from "next-auth/providers/github";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [GitHub],
	callbacks: {
		session({ session }) {
			return session;
		},
	},
});

/** Check if the authenticated user is an administrator. */
export async function isAdmin(
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<boolean> {
	const session = await auth(req, res);

	console.log(session);
	console.log(process.env.ADMIN_USER_ID);

	return session?.userId == process.env.ADMIN_USER_ID;
}
