import "katex/dist/katex.css";
import "highlight.js/styles/nord.css";
import { useEffect } from "react";
import useSize from "../../src/hooks/useSize";

export async function getStaticProps() {
  const { processMarkdownFile } = await import("../../src/processMarkdown");

  const renderedIntroduction = await processMarkdownFile(
    "./posts/renderer_introduction.md"
  );
  const renderedExplanation = await processMarkdownFile(
    "./posts/renderer_explanation.md"
  );

  return {
    props: {
      renderedIntroduction,
      renderedExplanation,
    },
  };
}

export default function ({
  renderedIntroduction,
  renderedExplanation,
}: {
  renderedIntroduction: string;
  renderedExplanation: string;
}) {
  useEffect(() => {
    // @ts-expect-error Loaded from macroquad
    load("rast.wasm");
  }, []);

  return (
    <>
      <div
        className="rmd"
        dangerouslySetInnerHTML={{ __html: renderedIntroduction }}
      />
      <br />
      <canvas
        id="glcanvas"
        tabIndex={1}
        className="w-full aspect-square overflow-hidden"
      ></canvas>
      <br />
      <div
        className="rmd"
        dangerouslySetInnerHTML={{ __html: renderedExplanation }}
      />
    </>
  );
}
