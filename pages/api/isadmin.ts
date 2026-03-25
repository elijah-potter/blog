import { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "../../src/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		if (await isAdmin(req, res)) {
			res.status(200).end();
		} else {
			res.status(401).end("Not authorized");
		}
	} catch {
		res.status(404).end();
	}
}
