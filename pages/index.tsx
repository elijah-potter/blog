import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Spacer from "../components/Spacer";
import { type FullPost, generatePartialPosts } from "../posts/articles";
import headshot from "../public/images/headshot.webp";
import { articleIdToSlug } from "../posts/articleId";

const iconLinks = [
	[
		"https://github.com/automattic/harper",
		"/icons/harper.svg",
		"Harper, a Grammar Checker for Developers",
	],
	[
		"https://github.com/elijah-potter/thrax-language",
		"/icons/thrax_logo.svg",
		"Thrax, a toy programming language I put together in late 2022 to learn about dynamic programming languages",
	],
	[
		"https://www.instagram.com/elijah_sirius/",
		"/icons/polaroid.svg",
		"Instagram, where I showcase my favorite personal pastime: photography",
	],
	[
		"/videos",
		"/icons/play.svg",
		"Short, animated, and occasionally informative videos",
	],
	[
		"https://www.linkedin.com/in/elijahpotter",
		"/icons/linkedin.svg",
		"LinkedIn and Resume",
	],
	["https://github.com/elijah-potter/", "/icons/github.svg", "GitHub"],
];

export async function getStaticProps() {
	return {
		props: {
			posts: await generatePartialPosts(),
		},
	};
}

export default function index({
	posts,
}: {
	posts: { [name: string]: FullPost };
}) {
	return (
		<>
			<Head>
				<meta
					name="description"
					content="The blog of software engineer Elijah Potter"
				/>
			</Head>
			<div className="flex flex-wrap items-center justify-evenly">
				<div className="scale-90 sm:scale-100">
					<Image
						className="rounded-full"
						src={headshot}
						width={250}
						height={250}
						alt="Headshot of Elijah Potter"
						priority
						placeholder="blur"
						sizes="(max-width: 640px) 225px, 250px"
					/>
				</div>
				<div className="flex flex-col">
					<h1 className="text-center text-4xl sm:text-6xl font-bold p-6 sm:p-16">
						Elijah Potter
					</h1>
					<h2 className="text-center text-2xl sm:text-3xl font-bold">
						Software Engineer
						<br />
						Working at <Link href="https://automattic.com/">Automattic</Link>
						<br />
						on <Link href="https://writewithharper.com">Harper</Link>
					</h2>
				</div>
			</div>
			<div className="pt-6 sm:pt-24" />
			<div className="md:flex md:flex-row grid grid-cols-4 items-center justify-evenly mt-5 transition-all place-items-center">
				{iconLinks.map(([href, icon, alt]) => (
					<Link
						href={href}
						key={href}
						className="flex flex-col justify-between items-center w-11/12 hover:scale-105 transition-all"
					>
						<Image
							width="60"
							height="60"
							src={icon}
							style={{
								filter: "var(--themefilter)",
							}}
							alt={alt}
							title={alt}
						/>
						<div className="hidden sm:block">
							<Spacer />
						</div>
					</Link>
				))}
			</div>
			<h2 className="text-3xl sm:text-4xl pt-8 sm:pt-16 font-bold flex items-center gap-2">
				Articles ↓
			</h2>
			<ul>
				{Object.entries(posts).map(([articleId, post], i) => {
					const target = `/articles/${articleIdToSlug(articleId)}`;

					return (
						<Link href={target} key={articleId} className="no-underline">
							<li
								className={`p-2 my-2 w-11/12 bg-white rounded ${i % 2 == 0 ? "skew-hover" : "skew-hover-left"} border-gray-300 hover:drop-shadow-lg border`}
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
									Published on{" "}
									{new Date(post.pubDate).toLocaleString(undefined, {
										dateStyle: "short",
									})}
								</p>
								<div
									dangerouslySetInnerHTML={{ __html: post.description_html }}
								/>
							</li>
						</Link>
					);
				})}
			</ul>
		</>
	);
}
