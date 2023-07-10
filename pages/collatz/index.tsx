import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Vector } from "../../src/vector";

export default function () {
  const width = 1000;
  const height = 1000;
  const points = 10000;
  const yScale = 100000;

  const [delta, setDelta] = useState<Vector>([0, 0]);

  const highestPoints = Array.from(
    { length: points },
    (_, index) => index + 1
  ).map(cMaxVisit);

  const svgElements = useMemo(() => {
    return Object.entries(highestPoints).map(([key, value]) => (
      <rect
        x={(parseInt(key) / points) * width}
        y={(value / yScale) * height}
        width="1"
        height="1"
        fill="white"
      />
    ));
  }, [width, height, points, yScale]);

  return (
    <motion.svg
      onPan={(_e, p) => setDelta([p.offset.x, p.offset.y])}
      version="1.1"
      width={width}
      height={height}
      transform={`translate(${delta[0]},${delta[1]})`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="optimizeSpeed"
    >
      {svgElements}
    </motion.svg>
  );
}

function cIter(x: number): number {
  if (x % 2 == 0) {
    return x / 2;
  } else {
    return 3 * x + 1;
  }
}

function cTravelTime(x: number): number {
  let c = 0;

  while (x != 1) {
    x = cIter(x);
    c++;
  }

  return c;
}

function cMaxVisit(x: number): number {
  let max = x;

  while (x != 1) {
    x = cIter(x);
    if (x > max) {
      max = x;
    }
  }

  return max;
}
