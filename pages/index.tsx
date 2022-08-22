import Image from "next/image";

export default function index() {
  return (
    <div className="h-container">
      <Image src="/profile.svg" width="225" height="300" />
      <h1 className="center-text huge-text">Elijah Potter</h1>
    </div>
  );
}
