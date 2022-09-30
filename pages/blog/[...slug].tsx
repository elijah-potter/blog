import Head from "next/head";
import { useRouter } from "next/router";
import processMarkdown from "../../processMarkdown";
import fs from "fs/promises";
import posts from "../../posts/posts";

const postNames = Object.keys(posts);

export async function getStaticProps() {
  const rendered = new Map();

  for (const postName of postNames) {
    const contents = await fs.readFile(`./posts/${postName}.md`, "utf8");

    const html = await processMarkdown(contents);
    rendered.set(postName, html);
  }

  return {
    props: {
      rendered: Object.fromEntries(rendered),
    },
  };
}

export async function getStaticPaths() {
  const paths = postNames.map((name) => {
    return { params: { slug: [name] } };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export default function render({
  rendered,
  dark,
}: {
  rendered: object;
  dark: boolean;
}) {
  const router = useRouter();

  const { slug } = router.query;

  if (slug === undefined) {
    console.log("No slug!");
    return;
  }

  let name = slug;

  if (typeof name !== "string") {
    name = slug[0];
  }

  const rendermap = new Map(Object.entries(rendered));

  const html = rendermap.get(name);

  if (typeof html !== "string") {
    console.log("Not a string!");
    return {
      notFound: true,
    };
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
          href={`https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/${
            dark ? "agate" : "default"
          }.min.css`}
          crossOrigin="anonymous"
        />
        <meta name="author" content={posts[name].author} />
        <meta name="description" content={posts[name].description} />
        <meta name="keywords" content={posts[name].keywords.join(", ")} />
      </Head>
      <div className="rmd" dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
}
