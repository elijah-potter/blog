export type HackerNewsPostListType =
	| "top"
	| "new"
	| "best"
	| "ask"
	| "show"
	| "job";

export type HackerNewsItemType =
	| "job"
	| "story"
	| "comment"
	| "poll"
	| "pollopt";

export interface HackerNewsItem {
	id: number;
	deleted?: boolean;
	type?: HackerNewsItemType;
	by?: string;
	time?: number;
	text?: string;
	dead?: boolean;
	parent?: number;
	poll?: number;
	kids?: number[];
	url?: string;
	score?: number;
	title?: string;
	parts?: number[];
	descendants?: number;
}

const postListEndpoints: Record<HackerNewsPostListType, string> = {
	top: "topstories",
	new: "newstories",
	best: "beststories",
	ask: "askstories",
	show: "showstories",
	job: "jobstories",
};

export class HackerNewsClient {
	private static readonly baseUrl = "https://hacker-news.firebaseio.com/v0";

	private constructor() {}

	public static getPostIds(type: HackerNewsPostListType): Promise<number[]> {
		return HackerNewsClient.request<number[]>(
			`${postListEndpoints[type]}.json`,
		);
	}

	public static getItem(id: number): Promise<HackerNewsItem | null> {
		return HackerNewsClient.request<HackerNewsItem | null>(`item/${id}.json`);
	}

	private static async request<T>(path: string): Promise<T> {
		const res = await fetch(`${HackerNewsClient.baseUrl}/${path}`);

		if (!res.ok) {
			throw new Error(`Hacker News API error ${res.status}`);
		}

		return (await res.json()) as T;
	}
}
