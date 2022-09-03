import Image from "next/image";
import Link from "next/link";

export default function index() {
  return (
    <>
      <div className="h-container">
        <Image src="/profile.svg" width="225" height="300" />
        <div className="v-container">
          <h1 className="center-text impact-text">Elijah Potter</h1>
          <h2 className="center-text subtitle-text">Software Developer.</h2>
        </div>
      </div>
      <div style={{ paddingTop: "100px" }} />
      <div className="h-container">
        <Link href="https://github.com/chilipepperhott/">
          <a>
            <Image
              width="100"
              height="100"
              src="/github.svg"
              className="shakehover depressclick"
            />
          </a>
        </Link>
        <Link href="https://www.linkedin.com/in/elijahpotter">
          <a>
            <Image
              width="100"
              height="100"
              src="/linkedin.svg"
              className="shakehover depressclick"
            />
          </a>
        </Link>
        <Link href="https://www.instagram.com/elijah_sirius/">
          <a>
            <Image
              width="100"
              height="100"
              src="/polaroid.svg"
              className="shakehover depressclick"
            />
          </a>
        </Link>
      </div>
    </>
  );
}
