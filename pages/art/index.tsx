import * as generativeArt from "generative-art";
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useSize from "../../src/hooks/useSize";
import { Vector } from "../../src/vector";
import startCase from "lodash/startCase";
import { downloadUint8Array } from "../../src/utils";

export async function getStaticProps() {
  const { processMarkdownFile } = await import("../../src/processMarkdown");
  const fs = await import("fs/promises");

  const renderedIntroduction = await processMarkdownFile(
    "./posts/generative_art_introduction.md"
  );

  return {
    props: {
      renderedIntroduction,
    },
  };
}

export default function ({
  renderedIntroduction,
}: {
  renderedIntroduction: string;
}) {
  const [containerRef, containerSize] = useSize();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<Uint8Array | null>(null);
  const [fileExt, setFileExt] = useState("");
  const [selected, setSelected] = useState("preslav");

  // Load initial image
  useEffect(() => {
    (async () => {
      const resp = await fetch("/images/art_default.jpg");
      setFileExt("jpg");
      setImage(new Uint8Array(await resp.arrayBuffer()));
    })();
  }, []);

  const pickerChange = (event: ChangeEvent) => {
    const picker = event.target as HTMLInputElement;
    const file_list = picker.files!;

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      setImage(new Uint8Array(reader.result as ArrayBufferLike));
      setFileExt(
        picker.value
          .split(/(\\|\/)/g)
          .pop()!
          .split(".")
          .pop()!
      );
    });

    reader.readAsArrayBuffer(file_list[0]);
  };

  const options: Record<string, [Definition, (...args: number[]) => void]> = {
    halftone: [halftoneDef, halftoneFn],
    preslav: [preslavDef, generativeArt.preslav],
    waves: [wavesDef, wavesFn],
  };

  return (
    <>
      <div
        className="rmd"
        dangerouslySetInnerHTML={{ __html: renderedIntroduction }}
      ></div>
      <div className="m-6">
        <label className="font-bold text-xl">Load File: </label>
        <input
          type="file"
          onChange={pickerChange}
          accept="jpg, .jpeg, .png, .tiff, .bmp"
        />
        <br />
        <label className="font-bold text-xl">Select Algorithm: </label>
        <select
          className="font-bold text-xl h-10"
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
        >
          {Object.keys(options).map((key) => (
            <option key={key} value={key}>
              {startCase(key)}
            </option>
          ))}
        </select>
      </div>
      <br />

      <div ref={containerRef}>
        <canvas
          ref={canvasRef}
          id="canvas"
          width={containerSize[0]}
          height={containerSize[0]}
        ></canvas>
        <RenderDef
          definition={options[selected][0]}
          canvasRef={canvasRef}
          size={containerSize}
          image={image}
          fileExt={fileExt}
          renderFn={options[selected][1]}
        />
      </div>
    </>
  );
}

type Definition = [string, number, number, number, "any" | number][];

const halftoneDef: Definition = [
  ["dotDensity", 1, 300, 10, 1],
  ["dotScale", 0, 2, 1.25, "any"],
  ["dotSides", 3, 16, 4, 1],
];

function halftoneFn(
  dotDensity: number,
  dotScale: number,
  dotSides: number,
  renderKind: number
) {
  generativeArt.halftone(dotDensity, dotScale, dotSides, "#000000", renderKind);
}

const wavesDef: Definition = [
  ["strokeWidth", 0, 0.05, 0.005, "any"],
  ["skipRows", 1, 200, 10, 1],
  ["frequencyMultiplier", 0, 1, 0.25, "any"],
  ["amplitudeMultiplier", 0, 10, 1, "any"],
  ["brightnessThreshold", 0, 1, 0, "any"],
];

function wavesFn(
  strokeWidth: number,
  skipRows: number,
  frequencyMultiplier: number,
  amplitudeMutliplier: number,
  brightnessThreshold: number,
  renderKind: number
) {
  generativeArt.waves(
    "#ffffff",
    "#000000",
    strokeWidth,
    skipRows,
    0,
    frequencyMultiplier,
    amplitudeMutliplier,
    false,
    brightnessThreshold,
    0,
    true,
    renderKind
  );
}

const preslavDef: Definition = [
  ["strokeJitter", 0.0001, 1, 0.1, "any"],
  ["strokeInversionThreshold", 0, 0.2, 0.05, "any"],
  ["alpha", 0, 1, 0.5, "any"],
  ["alphaIncrease", 0, 0.005, 0.0002, "any"],
  ["minEdgeCount", 3, 10, 3, 1],
  ["maxEdgeCount", 3, 10, 3, 1],
  ["strokeSize", 0, 1, 1, "any"],
  ["strokeReduction", 0, 0.05, 0.005, "any"],
  ["randomizeRotation", 0, Math.PI * 2, 0, "any"],
  ["shapes", 0, 1000, 500, 1],
  ["seed", 0, 1000, 0, 1],
];

const def: Definition = [
  ["objectCount", 1, 30, 3, 1],
  ["renderCount", 1, 30, 3, 1],
  ["minObjectSize", 0, 100, 0, "any"],
  ["maxObjectSize", 100, 10000, 100, "any"],
  ["g", 0, 3, 3, "any"],
  ["steps", 0, 3000, 1000, 1],
  ["stepSize", 0, 0.01, 0.001, "any"],
  ["zoom", 0.001, 3, 1, "any"],
  ["seed", 0, 1000, 1, 1],
];

function createDef(definition: Definition): Record<string, number> {
  const o: Record<string, number> = {};

  for (const [name, min, max, defaultValue] of definition) {
    o[name] = defaultValue;
  }

  return o;
}

function RenderDef({
  definition,
  canvasRef,
  size,
  image,
  fileExt,
  renderFn,
}: {
  definition: Definition;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  size: Vector;
  image: Uint8Array | null;
  fileExt: string;
  renderFn: any;
}) {
  const [state, setState] = useState(createDef(definition));
  const [lastRenderId, setLastRenderId] = useState(0);

  const render = useCallback(
    (kind: number): any => {
      const args = definition.map(([name]) => state[name]);
      args.push(kind);
      generativeArt.set_panic_hook();

      return renderFn(...args);
    },
    [state]
  );

  useEffect(() => {
    setState(createDef(definition));
  }, [definition]);

  useEffect(() => {
    if (image != null) {
      generativeArt.load_image(image, fileExt);
    }
  }, [image]);

  useEffect(() => {
    if (image == null) {
      return;
    }

    cancelAnimationFrame(lastRenderId);

    setLastRenderId(
      requestAnimationFrame(() => {
        try {
          render(1);
        } catch (_) {
          console.log("An error ocurred");
        }
      })
    );
  }, [canvasRef.current, size, state, image]);

  const items = definition.map(([name, min, max, defaultValue, step]) => (
    <BetterSlider
      key={name}
      value={state[name]}
      onChange={(v) => {
        setState((oldState) => {
          return { ...oldState, [name]: v };
        });
      }}
      min={min}
      max={max}
      label={startCase(name)}
      step={step}
    />
  ));

  return (
    <ul>
      <div className="flex flex-row">
        <button
          className="pad-20 m-5 w-full transition-all hover:translate-x-2"
          onClick={() => downloadUint8Array(render(2), "image.svg")}
        >
          Download SVG
        </button>
        <button
          className="pad-20 m-5 w-full transition-all hover:translate-x-2"
          onClick={() => downloadUint8Array(render(3), "image.png")}
        >
          Download PNG
        </button>
      </div>
      {items}
    </ul>
  );
}

function BetterSlider({
  value,
  onChange,
  min,
  max,
  label,
  step,
}: {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max: number;
  step: "any" | number;
}) {
  return (
    <div
      className="flex flex-row [&>*]:flex-auto"
      style={{ justifyContent: "left" }}
    >
      <h2
        className="font-bold"
        style={{
          flex: "0 1 200px",
        }}
      >
        {label}
      </h2>
      <input
        type="range"
        value={value}
        min={min ?? 0}
        max={max}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        step={step}
      />
    </div>
  );
}
