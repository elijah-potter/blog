import type { NextApiRequest, NextApiResponse } from "next";
import { insertComment } from "../../src/db/comments";
import { NewCommentSchema } from "../../src/db/schema";

const BLOCKED_KEYWORDS = [
	"carnal",
	"erotic",
	"minx",
	"nymphomaniac",
	"unsubscribe",
	"subscribe",
	"promotional",
	"warranty",
];

function containsBlockedKeyword(message: string): boolean {
	const lowerMessage = message.toLowerCase();
	return BLOCKED_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

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

	if (
		typeof newComment.message === "string" &&
		containsBlockedKeyword(newComment.message)
	) {
		return res.status(400).end("Comment rejected.");
	}

	const parsed = NewCommentSchema.parse(newComment);

	await insertComment(parsed);

	return res
		.status(303)
		.setHeader("Location", `/articles/${parsed.post}`)
		.end();
}
