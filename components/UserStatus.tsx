import { signOut, useSession } from "next-auth/react";
import SignIn from "./SignIn";
import UserAvatar from "./UserAvatar";

/** Shows the user's avatar if signed in, shows the sign in button otherwise. */
export default function UserStatus() {
	const { data: session } = useSession();

	if (!session?.user) {
		return <SignIn />;
	} else {
		return (
			<button className="flex flex-row items-center" onClick={() => signOut()}>
				<UserAvatar />
				<span>Sign out as {session.user.name}</span>
			</button>
		);
	}
}
