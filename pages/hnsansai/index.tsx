import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import FullPageOverlay from "../../components/FullPageOverlay";
import {
	HackerNewsClient,
	type HackerNewsItem,
	type HackerNewsPostListType,
} from "../../src/hackernews/client";

const postTypes: HackerNewsPostListType[] = [
	"top",
	"new",
	"best",
	"ask",
	"show",
	"job",
];

const postTypeLabels: Record<HackerNewsPostListType, string> = {
	top: "top",
	new: "new",
	best: "best",
	ask: "ask",
	show: "show",
	job: "jobs",
};

const blockedTerms = [
	"ai",
	"copilot",
	"openai",
	"open ai",
	"chatgpt",
	"gpt",
	"claude",
	"anthropic",
	"llm",
	"llms",
	"large language model",
];

interface HackerNewsPageProps {
	type: HackerNewsPostListType;
	items: HackerNewsItem[];
	error?: string;
}

const HNSANSAI_PROPS_CACHE_TTL_MS = 60 * 60 * 1000;

const hnsansaiPropsCache = new Map<
	HackerNewsPostListType,
	{
		expiresAt: number;
		props: HackerNewsPageProps;
	}
>();

const hnsansaiPropsInFlight = new Map<
	HackerNewsPostListType,
	Promise<HackerNewsPageProps>
>();

const isPostType = (value: unknown): value is HackerNewsPostListType => {
	return (
		typeof value === "string" &&
		postTypes.includes(value as HackerNewsPostListType)
	);
};

const getItemUrl = (item: HackerNewsItem): string => {
	return item.url ?? `https://news.ycombinator.com/item?id=${item.id}`;
};

const getItemDomain = (item: HackerNewsItem): string | null => {
	if (!item.url) return null;

	try {
		return new URL(item.url).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
};

const formatAge = (time?: number): string => {
	if (!time) return "unknown time";

	const seconds = Math.max(0, Math.floor(Date.now() / 1000 - time));
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
	if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	if (minutes > 0) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	return "just now";
};

const escapeRegExp = (value: string): string => {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const mentionsBlockedTerm = (value: string): boolean => {
	const normalized = value.toLowerCase();

	return blockedTerms.some((term) => {
		const escapedTerm = escapeRegExp(term);
		return new RegExp(`(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`, "i").test(
			normalized,
		);
	});
};

const getMetaContent = (tag: string): string => {
	return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "";
};

const fetchExternalHtml = async (url: string): Promise<string> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 2500);

	try {
		const res = await fetch(url, { signal: controller.signal });

		if (!res.ok) return "";

		const contentType = res.headers.get("content-type") ?? "";
		if (!contentType.includes("text/html")) return "";

		return await res.text();
	} catch {
		return "";
	} finally {
		clearTimeout(timeout);
	}
};

const getDescription = async (item: HackerNewsItem): Promise<string> => {
	if (!item.url) return "";

	const html = await fetchExternalHtml(item.url);
	const descriptionTag = html.match(
		/<meta\s+[^>]*(?:name|property)=["'](?:description|og:description|twitter:description)["'][^>]*>/i,
	)?.[0];

	return descriptionTag ? getMetaContent(descriptionTag) : "";
};

const getArticleContent = async (item: HackerNewsItem): Promise<string> => {
	if (!item.url) return "";

	try {
		const html = await fetchExternalHtml(item.url);
		if (!html) return "";

		const [{ Readability }, { JSDOM }] = await Promise.all([
			import("@mozilla/readability"),
			import("jsdom"),
		]);
		const dom = new JSDOM(html, { url: item.url });
		const article = new Readability(dom.window.document).parse();

		return article?.textContent ?? "";
	} catch {
		return "";
	}
};

const isAllowedHackerNewsItem = async (
	item: HackerNewsItem | null,
): Promise<boolean> => {
	if (!item?.title || item.deleted || item.dead) return false;
	if (mentionsBlockedTerm([item.title, item.text, item.url].join(" "))) {
		return false;
	}

	const description = await getDescription(item);
	if (mentionsBlockedTerm(description)) return false;

	const articleContent = await getArticleContent(item);
	return !mentionsBlockedTerm(articleContent);
};

const filterAllowedHackerNewsItems = async (
	items: (HackerNewsItem | null)[],
): Promise<HackerNewsItem[]> => {
	const allowed = await Promise.all(items.map(isAllowedHackerNewsItem));

	return items.filter(
		(item, index): item is HackerNewsItem => Boolean(item) && allowed[index],
	);
};

const HackerNewsPage: NextPage<HackerNewsPageProps> = ({
	type,
	items,
	error,
}) => {
	return (
		<>
			<Head>
				<title>HNSansAI</title>
			</Head>

			<FullPageOverlay className="bg-[#f6f6ef]">
				<main className="min-h-screen bg-[#f6f6ef] text-[#000] [font-family:Verdana,Geneva,sans-serif] text-[12.5pt]">
					<header className="flex flex-wrap items-center gap-x-2 bg-[#ff6600] px-1 py-0.5 leading-tight">
						<Link href="/hnsansai" className="font-bold text-black">
							HNSansAI
						</Link>
						<nav className="flex flex-wrap items-center gap-x-1">
							{postTypes.map((postType, index) => (
								<span key={postType} className="flex items-center gap-x-1">
									<Link
										href={`/hnsansai?type=${postType}`}
										className={
											postType === type ? "font-bold" : "hover:underline"
										}
									>
										{postTypeLabels[postType]}
									</Link>
									{index < postTypes.length - 1 && <span>|</span>}
								</span>
							))}
						</nav>
					</header>

					<section className="px-2 py-3">
						<p className="mb-3 text-[#828282]">
							I like Hacker News, but I don't love that so much of it has turned
							into discussion of a single topic: AI. This is a version of
							HackerNews, filtered to remove any article focusing on "AI".
							Refreshes about every ten minutes.
						</p>

						{error && <p className="mb-3 text-red-700">{error}</p>}

						{items.length ? (
							<ol className="space-y-1">
								{items.map((item, index) => {
									const domain = getItemDomain(item);

									return (
										<li
											key={item.id}
											className="grid grid-cols-[2.5rem_1fr] gap-x-1"
										>
											<div className="text-right text-[#828282]">
												{index + 1}.
											</div>
											<div>
												<div className="leading-tight">
													<a
														href={getItemUrl(item)}
														className="hover:underline"
													>
														{item.title}
													</a>
													{domain && (
														<span className="ml-1 text-[10pt] text-[#828282]">
															({domain})
														</span>
													)}
												</div>
												<div className="text-[8.75pt] leading-tight text-[#828282]">
													{item.score ?? 0} points by {item.by ?? "unknown"}{" "}
													{formatAge(item.time)} |{" "}
													<a
														href={`https://news.ycombinator.com/item?id=${item.id}`}
														className="hover:underline"
													>
														{item.descendants ?? 0} comments
													</a>
												</div>
											</div>
										</li>
									);
								})}
							</ol>
						) : (
							<p className="text-[#828282]">No posts found.</p>
						)}
					</section>
				</main>
			</FullPageOverlay>
		</>
	);
};

const generateHackerNewsPageProps = async (
	type: HackerNewsPostListType,
): Promise<HackerNewsPageProps> => {
	try {
		const ids = await HackerNewsClient.getPostIds(type);
		const items = await Promise.all(
			ids.slice(0, 30).map((id) => HackerNewsClient.getItem(id)),
		);

		return {
			type,
			items: await filterAllowedHackerNewsItems(items),
		};
	} catch (err) {
		return {
			type,
			items: [],
			error: err instanceof Error ? err.message : "Failed to load Hacker News.",
		};
	}
};

export const getServerSideProps: GetServerSideProps<
	HackerNewsPageProps
> = async (context) => {
	const requestedType = context.query.type;
	const type = isPostType(requestedType) ? requestedType : "top";
	const cached = hnsansaiPropsCache.get(type);

	context.res.setHeader("Cache-Control", "public, max-age=60");

	if (cached && cached.expiresAt > Date.now()) {
		return { props: cached.props };
	}

	const inFlight = hnsansaiPropsInFlight.get(type);
	if (inFlight) {
		return { props: await inFlight };
	}

	const propsPromise = generateHackerNewsPageProps(type);
	hnsansaiPropsInFlight.set(type, propsPromise);

	try {
		const props = await propsPromise;
		hnsansaiPropsCache.set(type, {
			expiresAt: Date.now() + HNSANSAI_PROPS_CACHE_TTL_MS,
			props,
		});

		return { props };
	} finally {
		hnsansaiPropsInFlight.delete(type);
	}
};

export default HackerNewsPage;
