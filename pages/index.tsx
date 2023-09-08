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
    "/markov",
    "/icons/matrix.svg",
    "How Markov chains can be used in the real world",
  ],
  [
    "/art",
    "/icons/eye.svg",
    "Showcase and generate visually stunning creations, from any photo",
  ],
  [
    "/renderer",
    "/icons/mesh.svg",
    "The story of building a software renderer from scratch",
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
      <div className="wrapping h-container">
        <div>
          <Image
            className="headshot"
            src="/images/headshot.webp"
            width="300"
            height="300"
            alt="Headshot of Elijah Potter"
          />
        </div>
        <div className="v-container">
          <h1 className="center-text impact-text">Elijah Potter</h1>
          <h2 className="center-text subtitle-text">
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
      <div className={"v-container"}>
        {iconLinks.map(([href, icon, alt]) => (
          <a
            href={href}
            key={href}
            className="large-pad card h-container seven-eighths-width"
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
            <h2 className="readable-text three-quarter-width">{alt}</h2>
          </a>
        ))}
      </div>
    </>
  );
}
