import startCase from "lodash/startCase";
import Link from "next/link";
import posts from "../../posts/posts";

const postNames = Object.keys(posts);

export default function Blog() {
  return (
    <>
      <h1 className="subtitle-text">Blog</h1>
      <ul className="unstyled-list">
        {postNames.map((name) => {
          return (
            <Link href={`/blog/${name}`} key={name}>
              <a>
                <li className="sliderighthover transitionnormal">
                  <h4 className="subtitle-text">{startCase(name)}</h4>
                  <p>{posts[name].description}</p>
                </li>
              </a>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
