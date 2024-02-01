import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Spacer from "../components/Spacer";
import useMobile from "../src/hooks/useMobile";

const iconLinks = [
  [
    "/articles",
    "/icons/type.svg",
    "Articles on books, low-level computer science, and the concept of learning",
  ],
  [
    "https://github.com/chilipepperhott/thrax-language",
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
  ["/nbody", "/icons/orbit.svg", "Yet another n-body simulation"],
  [
    "/art",
    "/icons/eye.svg",
    "Showcase and generate visually stunning creations, from any photo",
  ],
  [
    "https://www.linkedin.com/in/elijahpotter",
    "/icons/linkedin.svg",
    "LinkedIn and Resume",
  ],
  ["https://github.com/chilipepperhott/", "/icons/github.svg", "GitHub"],
  // This is not ready for public consumption, it may never be
  // [
  //   "/fluid",
  //   "/icons/air.svg",
  //   "A story about Lake Gregory in Australia and Climate Models",
  // ],
];

export default function index() {
  const isMobile = useMobile();

  return (
    <>
      <Head>
        <meta
          name="description"
          content="The personal site for software developer and student Elijah Potter"
        />
      </Head>
      <div className="flex flex-wrap items-center justify-evenly">
        <div>
          <Image
            className="rounded-full"
            src="/images/headshot.webp"
            width="300"
            height="300"
            alt="Headshot of Elijah Potter"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-center text-6xl font-bold p-16">Elijah Potter</h1>
          <h2 className="text-center text-3xl font-bold">
            Software Developer
            <br />
            Working at{" "}
            <Link href="https://archytasinc.com/">Archytas Automation</Link>
            <br />
            On{" "}
            <Link href="https://hdiharmony.web.app/book/index.html">
              HDI Harmony
            </Link>
          </h2>
        </div>
      </div>
      <div style={{ paddingTop: "100px" }} />
      <div className={"flex flex-col items-center"}>
        {iconLinks.map(([href, icon, alt]) => (
          <a
            href={href}
            key={href}
            className="py-12 flex flex-row justify-between items-center w-11/12 hover:translate-x-5 transition-all"
          >
            <Image
              width="80"
              height="80"
              src={icon}
              style={{
                filter: "var(--themefilter)",
              }}
              alt={alt}
            />
            <Spacer></Spacer>
            <h2 className="text-lg md:text-2xl w-9/12 text-right">{alt}</h2>
          </a>
        ))}
      </div>
    </>
  );
}
