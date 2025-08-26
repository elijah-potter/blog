import Head from "next/head";
import { type FullPost, generateFullPosts } from "../../posts/articles";
import "katex/dist/katex.css";
import "highlight.js/styles/hybrid.css";
import { sampleSize } from "lodash";
import Link from "next/link";
import ScrollProgressBar from "../../components/ScrollProgressBar";

export async function getServerSideProps({ params }: any) {
	const { slug } = params;

	if (slug === undefined) {
		console.log("No slug!");
		return;
	}

	let name = slug;

	if (typeof name !== "string") {
		name = slug[0];
	}

	const posts = await generateFullPosts();
	const post = posts[name];

	const featuredPosts = sampleSize(
		Object.entries(posts).filter(([a]) => a != name),
		3,
	);

	return {
		props: {
			post,
			featuredPosts,
			name,
		},
	};
}

export default function ({
	post,
	name,
	featuredPosts,
}: {
	name: string;
	post: FullPost;
	featuredPosts: [string, FullPost][];
}) {
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
					content={`https://elijahpotter.dev/articles/${name}`}
				/>
				<meta property="og:type" content="article" />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.description} />
				<link
					rel="canonical"
					href={`https://elijahpotter.dev/articles/${name}`}
				/>
				{post.image && <meta property="og:image" content={post.image} />}
				<title>{post.title}</title>
				<meta name="author" content={post.author} />
				<meta name="description" content={post.description} />
				<meta name="keywords" content={post.keywords.join(", ")} />
			</Head>
			<div className="rmd" dangerouslySetInnerHTML={{ __html: html }}></div>

			<div className="border-t border-black">
				<h2 className="text-2xl font-bold my-4">Other Stuff</h2>
				{featuredPosts.map(([key, post]) => (
					<Link href={`/articles/${key}`}>
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
