import Head from "next/head";
import { type FullPost, generateFullPosts } from "../../posts/postGeneration";
import "katex/dist/katex.css";
import "highlight.js/styles/hybrid.css";
import { sampleSize } from "lodash";
import Link from "next/link";
import ScrollProgressBar from "../../components/ScrollProgressBar";
import { articleIdToSlug, slugToArticleId } from "../../posts/articleId";
import CommentForm from "../../src/CommentForm";
import CommentRow from "../../src/CommentRow";
import { getCommentsForPost } from "../../src/db/comments";
import type { Comment } from "../../src/db/schema";

export async function getServerSideProps({ params }: any) {
	let { slug } = params;

	if (slug === undefined) {
		console.log("No slug!");
		return;
	}

	if (typeof slug !== "string") {
		slug = slug[0];
	}

	if (typeof slug !== "string") {
		return 500;
	}

	// Redirect to dash-separated slug.
	const articleId = slugToArticleId(slug);
	if (articleId == slug) {
		return {
			redirect: {
				destination: `/articles/${articleIdToSlug(articleId)}`,
				permanent: false,
			},
		};
	}

	const posts = await generateFullPosts();
	const post = posts[articleId];

	let comments: Comment[] = [];

	try {
		comments = await getCommentsForPost(articleId);
	} catch {
		console.log("Unable to get comments.");
	}

	const featuredPosts = sampleSize(
		Object.entries(posts).filter(([a, b]) => a != slug && b.featured === true),
		3,
	);

	const commentsJSON = JSON.stringify(comments);

	return {
		props: {
			commentsJSON,
			post,
			featuredPosts,
			articleId,
		},
	};
}

export default function ({
	commentsJSON,
	post,
	articleId,
	featuredPosts,
}: {
	commentsJSON: string;
	articleId: string;
	post: FullPost;
	featuredPosts: [string, FullPost][];
}) {
	const comments: Comment[] = JSON.parse(commentsJSON);
	const html = post?.content_html;

	if (typeof html !== "string") {
		console.log("Not a string!");
		return {
			notFound: true,
		};
	}

	return (
		<>
			<ScrollProgressBar />
			<Head>
				<meta
					property="og:url"
					content={`https://elijahpotter.dev/articles/${articleId}`}
				/>
				<meta property="og:type" content="article" />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.description} />
				<link
					rel="canonical"
					href={`https://elijahpotter.dev/articles/${articleId}`}
				/>
				{post.image && <meta property="og:image" content={post.image} />}
				<title>{post.title}</title>
				<meta name="author" content={post.author} />
				<meta name="description" content={post.description} />
				<meta name="keywords" content={post.keywords.join(", ")} />
			</Head>

			<div className="rmd" dangerouslySetInnerHTML={{ __html: html }}></div>

			<p className="italic">
				This post was proofread by{" "}
				<a href="https://writewithharper.com">Harper</a>.
			</p>

			<div>
				<h2 className="text-2xl font-bold my-4">Comments</h2>
				{comments.map((c) => (
					<CommentRow comment={c} />
				))}
			</div>

			<CommentForm post={articleId} />

			<div className="border-t border-black">
				<h2 className="text-2xl font-bold my-4">Other Stuff</h2>
				{featuredPosts.map(([key, post]) => (
					<Link href={`/articles/${key}`} className="no-underline" key={key}>
						<div className="border border-gray-300 rounded py-4 px-3 mt-4 transition-all hover:translate-x-4">
							<h3 className="font-bold text-xl">{post.title}</h3>
							<p className="text-lg no-underline">{post.description}</p>
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
