import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [GitHub],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				// User is available during sign-in
				token.id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = token.id;
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

	return session?.user?.id == process.env.ADMIN_USER_ID;
}
