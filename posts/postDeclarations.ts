import fs from "fs/promises";
import path from "path";
import { clone } from "lodash";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";
import {
	getPostDeclarations as getLegacyPostDeclarations,
	type PostDeclaration,
} from "./articles";

type FrontmatterPostDeclaration = PostDeclaration & {
	draft?: boolean;
};

type MarkdownRoot = {
	children?: Array<{
		type?: string;
		value?: unknown;
	}>;
};

const frontmatterProcessor = unified()
	.use(remarkParse)
	.use(remarkFrontmatter, ["yaml"]);

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateFrontmatter(
	fileName: string,
	frontmatter: Record<string, unknown>,
): FrontmatterPostDeclaration {
	const {
		description,
		featured,
		image = null,
		keywords,
		pubDate,
		draft,
	} = frontmatter;

	if (typeof description !== "string" || !description.trim()) {
		throw new Error(
			`Post ${fileName} has front matter but is missing a valid description.`,
		);
	}

	if (
		typeof pubDate !== "string" ||
		Number.isNaN(new Date(pubDate).valueOf())
	) {
		throw new Error(
			`Post ${fileName} has front matter but is missing a valid pubDate.`,
		);
	}

	if (
		!Array.isArray(keywords) ||
		keywords.some((keyword) => typeof keyword !== "string")
	) {
		throw new Error(
			`Post ${fileName} has front matter but is missing valid keywords.`,
		);
	}

	if (image !== null && typeof image !== "string") {
		throw new Error(
			`Post ${fileName} has front matter but includes an invalid image value.`,
		);
	}

	if (featured !== undefined && typeof featured !== "boolean") {
		throw new Error(
			`Post ${fileName} has front matter but includes an invalid featured value.`,
		);
	}

	if (draft !== undefined && typeof draft !== "boolean") {
		throw new Error(
			`Post ${fileName} has front matter but includes an invalid draft value.`,
		);
	}

	return {
		description,
		pubDate,
		keywords: [...keywords],
		image,
		...(featured === undefined ? {} : { featured }),
		...(draft === undefined ? {} : { draft }),
	};
}

function parseFrontmatter(
	fileName: string,
	fileContent: string,
): FrontmatterPostDeclaration | null {
	const tree = frontmatterProcessor.parse(fileContent) as MarkdownRoot;
	const firstChild = tree.children?.[0];

	if (firstChild?.type !== "yaml") {
		return null;
	}

	const parsed = parseYaml(
		typeof firstChild.value === "string" ? firstChild.value : "",
	);

	if (!isRecord(parsed)) {
		throw new Error(`Post ${fileName} has malformed front matter.`);
	}

	return validateFrontmatter(fileName, parsed);
}

export async function getPostDeclarations(): Promise<
	Record<string, PostDeclaration>
> {
	const files = (await fs.readdir("./posts"))
		.filter((file) => file.endsWith(".md"))
		.sort();
	const legacyPosts = getLegacyPostDeclarations();
	const declarations = await Promise.all(
		files.map(async (fileName) => {
			const fileContent = await fs.readFile(
				path.join("./posts", fileName),
				"utf8",
			);
			const key = path.basename(fileName, ".md");
			const frontmatter = parseFrontmatter(fileName, fileContent);

			if (frontmatter) {
				if (frontmatter.draft) {
					return null;
				}

				const { draft: _draft, ...postDeclaration } = frontmatter;
				return [key, postDeclaration] as const;
			}

			const legacyDeclaration = legacyPosts[key];
			if (!legacyDeclaration) {
				return null;
			}

			return [key, clone(legacyDeclaration)] as const;
		}),
	);

	return Object.fromEntries(declarations.filter((entry) => entry !== null));
}

export type { PostDeclaration };
