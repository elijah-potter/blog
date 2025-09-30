import { Comment } from "./db/schema";
import Gravatar from "react-gravatar";

export default function CommentRow(comment: Comment) {
	return (
		<div className="flex space-x-4 p-4 border-b">
			<Gravatar email={comment.email} className="aspect-square" />
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<span className="font-semibold text-gray-800">{comment.name}</span>
					<span className="text-sm text-gray-500">
						{new Date(comment.timestamp).toLocaleString()}
					</span>
				</div>
				<p className="mt-1 text-gray-700">{comment.message}</p>
			</div>
		</div>
	);
}
