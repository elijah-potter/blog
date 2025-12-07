import Link from "next/link";
import Image from "next/image";
import { articleIdToSlug } from "../posts/articleId";
import type { FullPost } from "../posts/postGeneration";

type ArticleListProps = {
	title: string;
	subtitle: string;
	posts: [string, FullPost][];
};

export default function ArticleList({
	title,
	subtitle,
	posts,
}: ArticleListProps) {
	if (!posts.length) {
		return null;
	}

	return (
		<section className="pt-8 sm:pt-16">
			<h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
				{title}
			</h2>
			<h3 className="text-xl sm:text-xl font-bold flex items-center gap-2">
				{subtitle}
			</h3>
			<ul>
				{posts.map(([articleId, post], index) => {
					const target = `/articles/${articleIdToSlug(articleId)}`;

					return (
						<Link
							href={target}
							key={articleId}
							className={`p-4 my-2 bg-white rounded ${
								index % 2 === 0 ? "skew-hover" : "skew-hover-left"
							} border-gray-300 hover:drop-shadow-lg border no-underline flex flex-row gap-2 justify-between group
              `}
						>
							<li onClick={() => (location.href = target)}>
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
									Published on{" "}
									{new Date(post.pubDate).toLocaleString(undefined, {
										dateStyle: "short",
									})}
								</p>
								<div
									dangerouslySetInnerHTML={{ __html: post.description_html }}
								/>
							</li>

							{post.image ? (
								<div className="relative h-24 w-24 shrink-0 self-center hidden xl:inline-block">
									<Image
										src={post.image}
										fill
										alt={post.title}
										className="rounded object-cover scale-100 transition-all group-hover:scale-[200%] group-hover:translate-x-32"
										sizes="196px"
									/>
								</div>
							) : null}
						</Link>
					);
				})}
			</ul>
		</section>
	);
}
