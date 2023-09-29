export default function () {
  const videos = {
    "/videos/social_media.mp4":
      "A look at the psychological effects of social media, specifically for teenagers.\n Animated and edited in DaVinci Resolve for Psychology 101",
    "/videos/space.mp4":
      "A very short Star-Trek-esque animation created and rendered in Blender.",
    "/videos/moon.mp4":
      "An animated version of JFK's famous space race-era speech.",
    "/videos/obama.mp4":
      "An animated version of a speech Barack Obama gave during his first presidential campaign.",
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl py-10 font-bold">Videos</h1>
      {Object.entries(videos).map(([url, description]) => (
        <div key={url}>
          <video width="100%" controls>
            <source src={url} />
          </video>
          {description.split("\n").map((section) => (
            <h3 className="text-center italic">{section}</h3>
          ))}
          <br />
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
