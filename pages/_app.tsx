import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Spacer from "../components/Spacer";
import Link from "next/link";
import { AppProps } from "next/app";
import Image from "next/image";
import "../global.css";
import Script from "next/script";

type Theme = "light" | "dark" | "default";

export default function App({ Component, pageProps }: AppProps) {
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
        dark ? "var(--grey)" : "var(--light-grey)"
      );
      root.style.setProperty("--themefilter", dark ? "invert()" : "none");

      if (theme !== "default") {
        localStorage.setItem("theme", theme);
      }
    }
  }, [dark]);

  return (
    <>
      <Head>
        <title>Elijah Potter</title>
        <script
          src="https://not-fl3.github.io/miniquad-samples/mq_js_bundle.js"
          defer
        />
      </Head>
      <script
        data-goatcounter="https://potterblog.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"
      ></script>
      <div className="flex flex-row items-center">
        <Spacer />
        <div style={{ width: "clamp(50%, 768px, 90%)" }}>
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
          <Component {...pageProps} dark={dark} />
        </div>
        <Spacer />
      </div>
    </>
  );
}
