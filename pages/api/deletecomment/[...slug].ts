import type { NextApiRequest, NextApiResponse } from "next";
import { deleteComment, getCommentFromId } from "../../../src/db/comments";
import { auth } from "../../../src/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "DELETE") {
		res.setHeader("Allow", "DELETE");
		return res.status(405).end("Method Not Allowed");
	}

	let idStr = req.query.slug;
	if (Array.isArray(idStr)) {
		idStr = idStr[0];
	}

	if (typeof idStr != "string") {
		return res.status(400).end();
	}

	const id = parseInt(idStr);
	const comment = await getCommentFromId(id);

	if (comment == undefined) {
		return res.status(404).end(`Unable to find comment ${id}.`);
	}

	const session = await auth(req, res);

	console.log(session);
	console.log(process.env.ADMIN_USER_ID);

	if (session?.user?.id == process.env.ADMIN_USER_ID) {
		await deleteComment(id);
	} else {
		return res.status(401).end("Not authorized");
	}
}
