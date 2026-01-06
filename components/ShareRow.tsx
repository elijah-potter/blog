import Image from "next/image";

type ShareRowProps = {
	title: string;
	link: string;
};

const buttonClassName =
	"inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold no-underline transition-all hover:-translate-y-0.5 hover:drop-shadow";

export default function ShareRow({ title, link }: ShareRowProps) {
	const encodedTitle = encodeURIComponent(title);
	const encodedLink = encodeURIComponent(link);
	const encodedText = encodeURIComponent(`${title} ${link}`);

	const shareLinks = [
		{
			name: "Reddit",
			href: `https://www.reddit.com/submit?url=${encodedLink}&title=${encodedTitle}`,
			iconSrc: "/icons/reddit.svg",
		},
		{
			name: "BlueSky",
			href: `https://bsky.app/intent/compose?text=${encodedText}`,
			iconSrc: "/icons/bluesky.svg",
		},
		{
			name: "LinkedIn",
			href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}&title=${encodedTitle}`,
			iconSrc: "/icons/linkedin.svg",
		},
		{
			name: "X",
			href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedLink}`,
			iconSrc: "/icons/x.svg",
		},
		{
			name: "Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedTitle}`,
			iconSrc: "/icons/facebook.svg",
		},
	];

	return (
		<div className="my-6 flex flex-wrap gap-2">
			{shareLinks.map(({ name, href, iconSrc }) => (
				<a
					key={name}
					href={href}
					className={buttonClassName}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Share on ${name}`}
					title={`Share on ${name}`}
				>
					<Image
						src={iconSrc}
						width={16}
						height={16}
						alt={`${name} icon`}
						style={{ filter: "var(--themefilter)" }}
					/>
					<span>{name}</span>
				</a>
			))}
		</div>
	);
}
