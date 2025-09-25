import type { NextApiRequest, NextApiResponse } from "next";
import { getCommentsForPost } from "../../../src/db/comments";
import { Comment } from "../../../src/db/schema";

type Data = { comments: Comment[] };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	try {
		const comments = await getCommentsForPost(req.query.slug as string);

		res.status(200).json({ comments });
	} catch {
		res.status(404).end();
	}
}
