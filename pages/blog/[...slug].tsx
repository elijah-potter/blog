import { useRouter } from "next/router";
import processPosts from "../../processPosts";

export async function getServerSideProps() {
  const rendered = await processPosts();

  return {
    props: {
      rendered: Object.fromEntries(rendered),
    },
  };
}

export default function render(props: { rendered: object }) {
  const router = useRouter();

  const { slug } = router.query;

  if (slug === undefined) {
    console.log("No slug!");
    return;
  }

  let filename = slug;

  if (typeof filename !== "string") {
    filename = slug[0];
  }

  if (!filename.endsWith(".md")) {
    filename += ".md";
  }

  const rendermap = new Map(Object.entries(props.rendered));

  const html = rendermap.get(filename);

  if (typeof html !== "string") {
    console.log("Not a string!");
    return;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}
