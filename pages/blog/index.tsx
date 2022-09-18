import startCase from "lodash/startCase";
import Link from "next/link";
import postNames from "../../posts/posts.json";

export default function Blog(props: { rendered: object }) {
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
