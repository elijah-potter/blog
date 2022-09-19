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
                <li>
                  <h4 className="subtitle-text sliderighthover transition-normal">
                    {startCase(name)}
                  </h4>
                </li>
              </a>
            </Link>
          );
        })}
      </ul>
    </>
  );
}
