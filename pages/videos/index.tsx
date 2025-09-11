export default function () {
	const videos: Record<string, string> = {
		"youtube:e-jYf8ZV_SA":
			"WordCamp U.S. 2025 talk: using machine learning to improve application quality without big capital expenditures.",
		"youtube:l9D7M1gIY8I":
			"Conversation on Linkarzu's channel about Harper, open-source maintenance, and developer tooling.",
		"/videos/social_media.mp4":
			"A look at the psychological effects of social media, specifically for teenagers.\n Animated and edited in DaVinci Resolve for Psychology 101",
		"/videos/space.mp4":
			"A very short Star-Trek-esque animation created and rendered in Blender.",
		"/videos/moon.mp4":
			"An animated version of JFK's famous space race-era speech.",
		"/videos/obama.mp4":
			"An animated version of a speech Barack Obama gave during his first presidential campaign.",
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-4xl py-10 font-bold">Videos</h1>
			{Object.entries(videos).map(([url, description]) => {
				const isYouTube = url.startsWith("youtube:");
				const key = url;
				return (
					<div key={key}>
						{isYouTube ? (
							<iframe
								width="100%"
								height="400"
								src={`https://www.youtube.com/embed/${url.split(":")[1]}`}
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
							/>
						) : (
							<video width="100%" height="400" controls>
								<source src={url} />
							</video>
						)}
						{description.split("\n").map((section) => (
							<h3 className="text-center italic">{section}</h3>
						))}
						<br />
						<br />
						<br />
					</div>
				);
			})}
		</div>
	);
}
