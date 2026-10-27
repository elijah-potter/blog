import type { GetServerSideProps } from "next";

type GithubPullRequest = {
	html_url: string;
};

/**
 * Redirects to a random PR from the first 100 open Harper PRs, including drafts.
 * Falls back to the repository's PR list if the list is empty or fetching fails.
 */
export const getServerSideProps: GetServerSideProps = async () => {
	const repoPullsApi =
		"https://api.github.com/repos/automattic/harper/pulls?state=open&per_page=100";
	const fallback = "https://github.com/automattic/harper/pulls";

	try {
		const res = await fetch(repoPullsApi, {
			headers: {
				Accept: "application/vnd.github+json",
			},
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status}`);
		}

		const pulls = (await res.json()) as GithubPullRequest[];
		const destination =
			pulls.length > 0
				? pulls[Math.floor(Math.random() * pulls.length)].html_url
				: fallback;

		return {
			redirect: {
				destination,
				permanent: false,
			},
		};
	} catch {
		return {
			redirect: {
				destination: fallback,
				permanent: false,
			},
		};
	}
};

export default function () {
	return <></>;
}
