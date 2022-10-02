import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage == "undefined") {
      return "default";
    }

    const stored = localStorage.getItem("theme");

    if (stored == null) {
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
      </Head>
      <Script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "3a3453ec9a054b6d9e4dd5a64d79c371"}'
      />
      <div className="h-container root">
        <Spacer />
        <div className="stage">
          <Navbar>
            <div className="mobilehide">
              <Image src="/icons/profile.svg" width="75" height="100" />
            </div>
            <Link href="/">
              <a>
                <h1>Elijah Potter</h1>
              </a>
            </Link>
            <Spacer />

            <Link href="/articles">
              <a>
                <h2>Articles</h2>
              </a>
            </Link>
            <Link href="/videos">
              <a>
                <h2>Videos</h2>
              </a>
            </Link>
            <Spacer />
            <div className="mobilehide">
              <Image
                className="depressclick transitionnormal"
                onClick={() => setTheme(dark ? "light" : "dark")}
                width="40"
                height="40"
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
