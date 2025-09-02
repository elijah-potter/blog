import type { GetServerSideProps } from "next";

type GithubIssue = {
  html_url: string;
  state: string;
  pull_request?: unknown;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const repoIssuesApi =
    "https://api.github.com/repos/automattic/harper/issues?state=open&per_page=100";

  try {
    const res = await fetch(repoIssuesApi, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      // Ensure no caching between requests so randomness works as expected.
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = (await res.json()) as GithubIssue[];
    // Filter to true issues (exclude PRs) and open state just in case.
    const issues = data.filter(
      (i) => i.state === "open" && typeof i.pull_request === "undefined",
    );

    const destination =
      issues.length > 0
        ? issues[Math.floor(Math.random() * issues.length)].html_url
        : "https://github.com/automattic/harper/issues";

    return {
      redirect: {
        destination,
        permanent: false,
      },
    };
  } catch (e) {
    // On failure, send users to the repo issues page.
    return {
      redirect: {
        destination: "https://github.com/automattic/harper/issues",
        permanent: false,
      },
    };
  }
};

export default function () {
  return <></>;
}

