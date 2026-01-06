import type { Comment } from "../../src/db/schema";
import { getRecentComments } from "../../src/db/comments";
import CommentRow from "../../src/CommentRow";

export async function getServerSideProps() {
	let comments = await getRecentComments(50);

	return {
		props: {
			comments,
		},
	};
}

export default function ({ comments }: { comments: Comment[] }) {
	return (
		<div>
			{comments.map((c) => (
				<CommentRow comment={c} key={c.id} />
			))}
		</div>
	);
}
