import Head from "next/head";
import { useRouter } from "next/router";
import posts from "../../posts/articles";
import "katex/dist/katex.css";
import "highlight.js/styles/nord.css";

const postNames = Object.keys(posts);

export async function getStaticProps() {
  const processMarkdownFile = (await import("../../src/processMarkdown"))
    .processMarkdownFile;

  const rendered = new Map();

  for (const postName of postNames) {
    const html = await processMarkdownFile(`./posts/${postName}.md`);
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

export default function render({ rendered }: { rendered: object }) {
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
        <meta name="author" content={posts[name].author} />
        <meta name="description" content={posts[name].description} />
        <meta name="keywords" content={posts[name].keywords.join(", ")} />
      </Head>
      <div className="rmd" dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
}
