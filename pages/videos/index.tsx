import Spacer from "../../components/Spacer";

export default function index() {
  const videos = {
    "/videos/social_media.mp4":
      "A look at the psychological effects of social media, specifically for teenagers.",
    "/videos/space.mp4": "A short animation created and rendered in Blender.",
    "/videos/moon.mp4":
      "An animated version of JFK's famous space race-era speech.",
    "/videos/obama.mp4":
      "An animated version of a speech Obama gave during his first presidential campaign.",
  };

  return (
    <>
      <h1 className="subtitle-text">Videos</h1>
      {Object.entries(videos).map(([url, description]) => (
        <>
          <video width="100%" controls>
            <source src={url} />
          </video>
          <h3 className="center-text">{description}</h3>
          <br />
          <br />
          <br />
        </>
      ))}
    </>
  );
}
