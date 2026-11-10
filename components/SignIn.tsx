import { signIn } from "next-auth/react";
import { useState } from "react";

/** Reveals sign-in after five activations; resets when the control unmounts. */
export default function SignIn() {
	const [clickCount, setClickCount] = useState(0);
	const revealed = clickCount >= 5;

	return (
		<button
			type="button"
			aria-label={revealed ? "Sign In" : "Reveal sign-in control"}
			onClick={() => {
				if (revealed) {
					void signIn();
				} else {
					setClickCount((count) => count + 1);
				}
			}}
		>
			<span className={revealed ? undefined : "invisible"}>Sign In</span>
		</button>
	);
}
