import "katex/dist/katex.css";
import "highlight.js/styles/nord.css";
import { useEffect } from "react";
import useSize from "../../src/hooks/useSize";

export async function getStaticProps() {
  const { processMarkdownFile } = await import("../../src/processMarkdown");

  const renderedIntroduction = await processMarkdownFile(
    "./posts/lake_gregory_introduction.md"
  );
  const renderedExplanation = await processMarkdownFile(
    "./posts/lake_gregory_explanation.md"
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
  const [containerRef, containerSize] = useSize();

  useEffect(() => {
    // @ts-expect-error Loaded from macroquad
    load("fluid.wasm");
  }, []);

  return (
    <>
      <div
        className="rmd"
        dangerouslySetInnerHTML={{ __html: renderedIntroduction }}
      />
      <br />

      <div
        ref={containerRef}
        style={{
          width: "100%",
        }}
      >
        <canvas
          id="glcanvas"
          tabIndex={1}
          width={containerSize[0]}
          height={containerSize[0]}
        ></canvas>
      </div>
      <br />
      <div
        className="rmd"
        dangerouslySetInnerHTML={{ __html: renderedExplanation }}
      />
    </>
  );
}
