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
