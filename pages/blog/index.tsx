import processPosts from "../../processPosts";
import startCase from "lodash/startCase";
import Link from "next/link";

export async function getServerSideProps() {
  const rendered = await processPosts();

  return {
    props: {
      rendered: Object.fromEntries(rendered),
    },
  };
}

export default function Blog(props: { rendered: object }) {
  const postNames = Object.keys(props.rendered);

  return (
    <>
      <h1 className="subtitle-text">Blog</h1>
      <ul className="unstyled-list">
        {postNames.map((name) => {
          let readableName;

          if (name.endsWith(".md")) {
            readableName = name.slice(0, name.length - 3);
          } else {
            readableName = name;
          }

          return (
            <Link href={`/blog/${name}`} key={name}>
              <a>
                <li>
                  <h4 className="subtitle-text sliderighthover transition-normal">
                    {startCase(readableName)}
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
