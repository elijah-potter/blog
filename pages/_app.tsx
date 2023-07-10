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
        async
        id="gtag"
        src="https://www.googletagmanager.com/gtag/js?id=G-C1XNRMTJ0S"
      ></script>
      <Script id="gtagstart">
        {`
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-C1XNRMTJ0S');
      `}
      </Script>
      <div className="h-container root">
        <Spacer />
        <div className="stage">
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
              <h1>Elijah Potter</h1>
            </Link>
            <Spacer />

            <Link href="/articles">
              <h2>Articles</h2>
            </Link>
            <Link href="/videos">
              <h2>Videos</h2>
            </Link>
            <Spacer />
            <div className="mobilehide">
              <Image
                className="depressclick transitionnormal"
                onClick={() => setTheme(dark ? "light" : "dark")}
                width="40"
                height="40"
                alt="Sun Icon to Enable/Disable Dark Mode"
                src="/icons/sun.svg"
                style={{
                  filter: "var(--themefilter)",
                }}
              />
            </div>
          </Navbar>
          <Component {...pageProps} dark={dark} />
        </div>
        <Spacer />
      </div>
    </>
  );
}
