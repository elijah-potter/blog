import Image from "next/image";
import Link from "next/link";

export default function index() {
  return (
    <>
      <div className="h-container">
        <Image
          className="headshot"
          src="/images/headshot.jpg"
          width="300"
          height="300"
        />
        <div className="v-container">
          <h1 className="center-text impact-text">Elijah Potter</h1>
          <h2 className="center-text subtitle-text">Software Developer.</h2>
        </div>
      </div>
      <div style={{ paddingTop: "100px" }} />
      <div className="h-container" style={{ flexWrap: "wrap" }}>
        <Link href="https://github.com/chilipepperhott/">
          <a className="padded">
            <Image
              width="100"
              height="100"
              src="/github.svg"
              className="shakehover depressclick transition-normal"
            />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/elijahpotter">
          <a className="padded">
            <Image
              width="100"
              height="100"
              src="/linkedin.svg"
              className="shakehover depressclick transition-normal"
            />
          </a>
        </Link>
        <Link href="https://www.instagram.com/elijah_sirius/">
          <a className="padded">
            <Image
              width="100"
              height="100"
              src="/polaroid.svg"
              className="shakehover depressclick transition-normal"
            />
          </a>
        </Link>
        <Link href="/blog">
          <a className="padded">
            <Image
              width="100"
              height="100"
              src="/type.svg"
              className="shakehover depressclick transition-normal"
            />
          </a>
        </Link>
      </div>
    </>
  );
}
