import startCase from "lodash/startCase";
import Head from "next/head";
import Link from "next/link";
import posts from "../../posts/articles";

const postNames = Object.keys(posts);

export default function () {
  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      <h1 className="text-3xl font-bold">Articles</h1>
      <ul>
        {postNames.map((name) => {
          const target = `/articles/${name}`;

          return (
            <li
              className="py-4 w-11/12 hover:translate-x-5 transition-all"
              onClick={() => (location.href = target)}
            >
              <Link href={target} key={name}>
                <h4 className="text-3xl py-4">{startCase(name)}</h4>
              </Link>
              <p>{posts[name].description}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
