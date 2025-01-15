import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Spacer from "../components/Spacer";
import Link from "next/link";
import { AppProps } from "next/app";
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

type Theme = "light" | "dark" | "default";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const showNavbar = router.query.navbar !== "no";

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof localStorage == "undefined") {
      return "default";
    }

    const stored = localStorage.getItem("theme");

    // TODO: Replace with io-ts
    if (stored == null || !(stored === "light" || stored === "dark")) {
      return "default";
    } else {
      return stored;
    }
  });

  const dark = useMemo(() => {
    switch (theme) {
      case "default":
        if (typeof window === "undefined") {
          return false;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      case "light":
        return false;
      case "dark":
        return true;
    }
  }, [theme]);

  useEffect(() => {
    const root: HTMLElement | null = document.querySelector(":root");

    if (root != null && root.style != null) {
      root.style.setProperty("--bg", dark ? "var(--black)" : "var(--white)");
      root.style.setProperty("--fg", dark ? "var(--white)" : "var(--black)");
      root.style.setProperty(
        "--lc",
        dark ? "var(--grey)" : "var(--light-grey)",
      );
      root.style.setProperty("--themefilter", dark ? "invert()" : "none");

      if (theme !== "default") {
        localStorage.setItem("theme", theme);
      }
    }
  }, [dark]);

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
                <button
                  onClick={() => setTheme(dark ? "light" : "dark")}
                  className="mobilehide"
                >
                  <Image
                    className="transition-all active:scale-75"
                    width="40"
                    height="40"
                    alt="Sun Icon to Enable/Disable Dark Mode"
                    src="/icons/sun.svg"
                    style={{
                      filter: "var(--themefilter)",
                    }}
                  />
                </button>
              </Navbar>
            )}
            <Component {...pageProps} dark={dark} />
          </div>
        </div>
      </PostHogProvider>
    </>
  );
}
