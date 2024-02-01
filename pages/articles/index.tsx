import startCase from "lodash/startCase";
import Head from "next/head";
import Link from "next/link";
import { FullPost, generateFullPosts } from "../../posts/articles";

export async function getStaticProps() {
  return {
    props: {
      posts: await generateFullPosts(),
    },
  };
}

export default function ({ posts }: { posts: { [name: string]: FullPost } }) {
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      <h1 className="text-3xl font-bold">Articles</h1>
      <ul>
        {Object.entries(posts).map(([name, post]) => {
          const target = `/articles/${name}`;

          return (
            <li
              className="py-4 w-11/12 hover:translate-x-5 transition-all"
              onClick={() => (location.href = target)}
            >
              <Link href={target} key={name}>
                <h4 className="text-3xl py-2">{startCase(name)}</h4>
              </Link>
              <p className="font-extrabold py-2">
                Published on{" "}
                {new Date(post.pubDate).toLocaleString(undefined, {
                  dateStyle: "short",
                })}
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: post.description_html }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
