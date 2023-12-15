import Head from "next/head";
import { useRouter } from "next/router";
import {
  FullPost,
  generatePartialPosts,
  generateFullPosts,
} from "../../posts/articles";
import "katex/dist/katex.css";
import "highlight.js/styles/nord.css";
import { startCase } from "lodash";

export async function getStaticProps() {
  return {
    props: {
      posts: await generateFullPosts(),
    },
  };
}

export async function getStaticPaths() {
  const paths = Object.keys(generatePartialPosts()).map((name) => {
    return { params: { slug: [name] } };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export default function ({ posts }: { posts: { [name: string]: FullPost } }) {
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

  const post = posts[name];
  const html = post?.content_html;

  if (typeof html !== "string") {
    console.log("Not a string!");
    return {
      notFound: true,
    };
  }

  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`https://elijahpotter.dev/articles/${name}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={startCase(name)} />
        <meta property="og:description" content={post.description} />
        {post.image && <meta property="og:image" content={post.image} />}
        <title>{startCase(name)}</title>
        <meta name="author" content={post.author} />
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(", ")} />
      </Head>
      <div className="rmd" dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
}
