import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const iconLinks = [
  [
    "https://github.com/chilipepperhott/",
    "/icons/github.svg",
    "GitHub profile and open source contributions.",
  ],
  [
    "https://www.linkedin.com/in/elijahpotter",
    "/icons/linkedin.svg",
    "LinkedIn profile and employment history.",
  ],
  [
    "https://www.instagram.com/elijah_sirius/",
    "/icons/polaroid.svg",
    "My Instagram Profile, including the results of my photography hobby.",
  ],
  ["/articles", "/icons/type.svg", "My written articles."],
  [
    "/videos",
    "/icons/play.svg",
    "Miscelaneus videos I've created for various classes.",
  ],
  ["/nbody", "/icons/orbit.svg", "Yet another n-body simulation"],
  [
    "/markov",
    "/icons/matrix.svg",
    "A demonstration of Markov chains for my Linear Algebra class.",
  ],
  [
    "/art",
    "/icons/eye.svg",
    "A playground to interact with several generative art algorithms.",
  ],
];

export default function index() {
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
            src="/images/headshot.jpg"
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
            <Link href="https://archytasinc.com/">Archytas Automation</Link>
          </h2>
        </div>
      </div>
      <div style={{ paddingTop: "100px" }} />
      <div className="wrapping h-container">
        {iconLinks.map(([href, icon, alt]) => (
          <Link href={href} key={href} className="large-pad">
            <Image
              width="100"
              height="100"
              src={icon}
              style={{
                filter: "var(--themefilter)",
              }}
              alt={alt}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
