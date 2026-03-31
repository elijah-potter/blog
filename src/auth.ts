import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import type { AdapterSession } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import { db } from "./db";

const nextAuth = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [GitHub],
	callbacks: {
		session({ session }) {
			return session;
		},
	},
});

export const { handlers, signIn, signOut } = nextAuth;

// Auth.js returns a session typed as Session, but our adapter-backed auth()
// calls expose the adapter session shape that includes userId.
export async function auth(
	req?: NextApiRequest,
	res?: NextApiResponse,
): Promise<AdapterSession | null> {
	if (req && res) {
		return (await nextAuth.auth(req, res)) as AdapterSession | null;
	}

	return (await nextAuth.auth()) as AdapterSession | null;
}

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
