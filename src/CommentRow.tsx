import { useEffect, useState } from "react";
import { Comment } from "./db/schema";
import Gravatar from "react-gravatar";
import { useRouter } from "next/router";

async function sendDeleteRequest(id: number) {
	await fetch(`/api/deletecomment/${id}`, { method: "DELETE" });
}

export default function CommentRow({ comment }: { comment: Comment }) {
	const [authorized, setAuthorized] = useState(false);
	let router = useRouter();

	useEffect(() => {
		fetch("/api/isadmin").then((res) => {
			console.log(res);
			setAuthorized(res.status == 200);
		});
	});

	return (
		<div className="flex space-x-4 p-4 border-b">
			<div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
				<Gravatar
					email={comment.email}
					size={48}
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<span className="font-semibold text-gray-800">{comment.name}</span>
					{authorized ? (
						<button
							className="font-semibold text-red-800"
							onClick={() =>
								sendDeleteRequest(comment.id).then(() => router.reload())
							}
						>
							Delete
						</button>
					) : (
						<></>
					)}
				</div>
				<p className="mt-1 text-gray-700">{comment.message}</p>
			</div>
		</div>
	);
}
