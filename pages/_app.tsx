import Head from "next/head";
import Navbar from "../components/Navbar";
import Spacer from "../components/Spacer";
import Link from "next/link";
import type { AppProps } from "next/app";
import Image from "next/image";
import "../global.css";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
	posthog.init("phc_ScKr9SxzZRlBn7d4FMFIZzYestHuFonat6gOStQ5t8x", {
		api_host: "https://us.i.posthog.com",
		persistence: "sessionStorage",
		person_profiles: "always",
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "development") posthog.debug();
		},
	});
}

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const showNavbar = router.query.navbar !== "no";

	return (
		<>
			<PostHogProvider client={posthog}>
				<Head>
					<title>Elijah Potter</title>
				</Head>
				<div className="flex flex-row justify-center">
					<div className="w-full p-4 sm:w-full md:w-[800px] m-5">
						{showNavbar && (
							<Navbar>
								<div className="mobilehide">
									<Image
										src="/icons/profile.svg"
										width="75"
										height="100"
										alt="Profile Picture"
									/>
								</div>
								<Link href="/">
									<h1 className="text-2xl">Elijah Potter</h1>
								</Link>
								<Spacer />
								<a href="/rss.xml">
									<Image
										width="25"
										height="25"
										alt="RSS Icon"
										src="/icons/rss.svg"
										style={{
											filter: "var(--themefilter)",
										}}
									/>
								</a>
							</Navbar>
						)}
						<Component {...pageProps} />
					</div>
				</div>
			</PostHogProvider>
		</>
	);
}
