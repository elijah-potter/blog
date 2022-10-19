import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const iconLinks = [
  [
    "https://github.com/chilipepperhott/",
    "/icons/github.svg",
    "GitHub icon linking to my GitHub profile and open source contributions.",
  ],
  [
    "https://www.linkedin.com/in/elijahpotter",
    "/icons/linkedin.svg",
    "LinkedIn icon linking to my LinkedIn profile and employment history.",
  ],
  [
    "https://www.instagram.com/elijah_sirius/",
    "/icons/polaroid.svg",
    "Poloroid icon linking to my Instagram, where I post the results of my photography hobby.",
  ],
  [
    "/articles",
    "/icons/type.svg",
    "Typeface icon linking to my written articles.",
  ],
  [
    "/videos",
    "/icons/play.svg",
    "Play icon linking to various demonstrative videos I have made.",
  ],
  ["/nbody", "/icons/orbit.svg", "Orbit icon linking to an N-Body simulation"],
];

export default function index({ dark }: { dark: boolean }) {
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
            <Link href="https://archytasinc.com/">
              <a>Archytas Automation</a>
            </Link>
          </h2>
        </div>
      </div>
      <div style={{ paddingTop: "100px" }} />
      <div className="wrapping h-container">
        {iconLinks.map(([href, icon, alt]) => (
          <Link href={href} key={href}>
            <a className="large-pad">
              <Image
                width="100"
                height="100"
                src={icon}
                className="depressclick transitionnormal mobilehide"
                style={{
                  filter: "var(--themefilter)",
                }}
                alt={alt}
              />
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}
