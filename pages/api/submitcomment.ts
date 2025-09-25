import type { NextApiRequest, NextApiResponse } from "next";
import { insertComment } from "../../src/db/comments";
import { NewCommentSchema } from "../../src/db/schema";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).end("Method Not Allowed");
	}

	const newComment = {
		post: req.body?.post,
		name: req.body?.name,
		email: req.body?.email,
		message: req.body?.message,
	};

	const parsed = NewCommentSchema.parse(newComment);

	await insertComment(parsed);

	return res
		.status(303)
		.setHeader("Location", `/articles/${parsed.post}`)
		.end();
}
