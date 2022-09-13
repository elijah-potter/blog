import Head from "next/head";
import { useRouter } from "next/router";
import processPosts from "../../processPosts";

export async function getStaticProps() {
  const rendered = await processPosts();

  return {
    props: {
      rendered: Object.fromEntries(rendered),
    },
  };
}

export async function getStaticPaths() {
  const rendered = await processPosts();

  const paths = Array.from(rendered.keys()).map((name) => {
    return { params: { slug: [name] } };
  });

  console.log(paths);

  return {
    paths: paths,
    fallback: false,
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

  const rendermap = new Map(Object.entries(props.rendered));

  const html = rendermap.get(filename);

  if (typeof html !== "string") {
    console.log("Not a string!");
    return;
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css"
          integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/default.min.css"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="post" dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
}
