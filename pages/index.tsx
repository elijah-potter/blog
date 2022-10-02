import Image from "next/image";
import Link from "next/link";

const iconLinks = [
  ["https://github.com/chilipepperhott/", "/icons/github.svg"],
  ["https://www.linkedin.com/in/elijahpotter", "/icons/linkedin.svg"],
  ["https://www.instagram.com/elijah_sirius/", "/icons/polaroid.svg"],
  ["/articles", "/icons/type.svg"],
  ["/videos", "/icons/play.svg"],
];

export default function index({ dark }: { dark: boolean }) {
  return (
    <>
      <div className="wrapping h-container">
        <div>
          <Image
            className="headshot"
            src="/images/headshot.jpg"
            width="300"
            height="300"
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
        {iconLinks.map(([href, icon]) => (
          <Link href={href} key={href}>
            <a className="padded">
              <Image
                width="100"
                height="100"
                src={icon}
                className="depressclick transitionnormal mobilehide"
                style={{
                  filter: "var(--themefilter)",
                }}
              />
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}
