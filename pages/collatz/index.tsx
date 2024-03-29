import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { addV, Vector } from "../../src/vector";

/** A mildly interactive graph of the highest visited values of the Collatz conjecture.
 * Not ready for public consumption
 */
export default function () {
  const points = 10000;
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const yScale = 10000;
  const [delta, setDelta] = useState<Vector>([1, 1]);

  const highestPoints = useMemo(
    () =>
      delta[0] < -1
        ? Array.from({ length: width }, (_, index) =>
            Math.max(Math.floor(index - delta[0]), index),
          ).map(cMaxVisit)
        : [],
    [delta],
  );

  console.log(delta);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    onResize();

    () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current != null) {
      render(canvasRef.current.getContext("2d")!, highestPoints, yScale, delta);
    }
  }, [width, height, points, yScale, canvasRef.current, delta]);

  return (
    <motion.canvas
      ref={canvasRef}
      onPan={(e, p) => setDelta(addV([p.delta.x, p.delta.y], delta))}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -100,
      }}
    ></motion.canvas>
  );
}

function render(
  ctx: CanvasRenderingContext2D,
  highestPoints: number[],
  yScale: number,
  delta: Vector,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#FFF";

  ctx.translate(...delta);

  for (let i = 0; i < highestPoints.length; i++) {
    const value = highestPoints[i];
    ctx.fillRect(
      (i / highestPoints.length) * ctx.canvas.width,
      (value / yScale) * ctx.canvas.height,
      1,
      1,
    );
  }

  ctx.resetTransform();
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
