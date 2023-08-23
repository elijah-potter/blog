import startCase from "lodash/startCase";
import Link from "next/link";
import posts from "../../posts/articles";

const postNames = Object.keys(posts);

export default function () {
  return (
    <>
      <h1 className="subtitle-text">Articles</h1>
      <ul className="unstyled-list">
        {postNames.map((name) => {
          const target = `/articles/${name}`;

          return (
            <li className="card" onClick={() => (location.href = target)}>
              <Link href={target} key={name}>
                <h4 className="subtitle-text">{startCase(name)}</h4>
              </Link>
              <p>{posts[name].description}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
