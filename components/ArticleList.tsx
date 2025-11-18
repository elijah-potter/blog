import Link from "next/link";
import { type FullPost } from "../posts/articles";
import { articleIdToSlug } from "../posts/articleId";

type ArticleListProps = {
	title: string;
	posts: [string, FullPost][];
};

export default function ArticleList({ title, posts }: ArticleListProps) {
	if (!posts.length) {
		return null;
	}

	return (
		<section className="pt-8 sm:pt-16">
			<h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
				{title}
			</h2>
			<ul>
				{posts.map(([articleId, post], index) => {
					const target = `/articles/${articleIdToSlug(articleId)}`;

					return (
						<Link href={target} key={articleId} className="no-underline">
							<li
								className={`p-4 my-2 w-11/12 bg-white rounded ${
									index % 2 === 0 ? "skew-hover" : "skew-hover-left"
								} border-gray-300 hover:drop-shadow-lg border`}
								onClick={() => (location.href = target)}
							>
								<h4 className="text-3xl py-2">{post.title}</h4>
								<p className="font-extrabold py-2">
									{post.featured ? (
										<span
											title="Featured"
											aria-label="Featured"
											className="text-yellow-500"
										>
											★
										</span>
									) : null}
									Published on {new Date(post.pubDate).toLocaleString(undefined, {
										dateStyle: "short",
									})}
								</p>
								<div dangerouslySetInnerHTML={{ __html: post.description_html }} />
							</li>
						</Link>
					);
				})}
			</ul>
		</section>
	);
}
