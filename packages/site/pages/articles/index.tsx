import startCase from "lodash/startCase";
import Link from "next/link";
import posts from "../../posts/articles";

const postNames = Object.keys(posts);

export default function Articles() {
  return (
    <>
      <h1 className="subtitle-text">Articles</h1>
      <ul className="unstyled-list">
        {postNames.map((name) => {
          return (
            <Link href={`/articles/${name}`} key={name}>
              <li>
                <h4 className="subtitle-text">{startCase(name)}</h4>
                <p>{posts[name].description}</p>
              </li>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
