import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UserAvatar() {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return (
		<div>
			<Image
				width={64}
				height={64}
				src={session.user.image ?? ""}
				alt="User Avatar"
			/>
		</div>
	);
}
