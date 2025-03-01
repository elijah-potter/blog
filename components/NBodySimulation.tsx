import clone from "lodash/clone";
import cloneDeep from "lodash/cloneDeep";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DrawableBody,
  Body,
  radiusFromMass,
  calculateStep,
} from "../src/simulation";
import { mulS, subV, Vector } from "../src/vector";
import { MouseEvent } from "react";

export const BODY_LINE_WIDTH = 2;
export const INITIAL_VELOCITY_COEFF = 0.05;
export const UI_BAR_THICKNESS = 10;
export const UI_BAR_LINE_WIDTH = 2;

function positionFromMouseEvent(e: MouseEvent<HTMLCanvasElement>): Vector {
  const rect = e.currentTarget.getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}

function primaryColor() {
  return "#fff";
}

function secondaryColor() {
  return "#151515";
}

function drawBody(ctx: CanvasRenderingContext2D, body: DrawableBody) {
  ctx.fillStyle = primaryColor();
  ctx.strokeStyle = secondaryColor();
  ctx.lineWidth = BODY_LINE_WIDTH;

  ctx.beginPath();
  ctx.arc(
    body.position[0],
    body.position[1],
    radiusFromMass(body.mass),
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
  ctx.stroke();
}

function renderBodies(ctx: CanvasRenderingContext2D, bodies: DrawableBody[]) {
  for (const body of bodies) {
    drawBody(ctx, body);
  }
}

function clamp(n: number, min: number, max: number): number {
  if (n < min) {
    return min;
  } else if (n > max) {
    return max;
  } else {
    return n;
  }
}

type ActiveMode =
  | { mode: "intro" }
  | {
      mode: "simulate";
    }
  | {
      mode: "createBody";
      dragStart: Vector;
      dragEnd: Vector;
    };

export default function index({
  initialBodies,
  interactive,
  zIndex,
}: {
  initialBodies: Body[];
  interactive: boolean;
  zIndex: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  const [targetMass, setTargetMass] = useState(10);
  const [mass, setMass] = useState(10);
  const [randomizeMass, setRandomizeMass] = useState(true);
  const [targetG, setTargetG] = useState(0.1);
  const [g, setG] = useState(0.1);

  const [activeMode, setActiveMode] = useState<ActiveMode>(
    interactive
      ? {
          mode: "intro",
        }
      : { mode: "simulate" }
  );

  const [bodies, setBodies] = useState<Body[]>(cloneDeep(initialBodies));

  const onMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) {
        return;
      }

      const newMouse = positionFromMouseEvent(e);

      if (activeMode.mode === "simulate" || activeMode.mode === "intro") {
        setActiveMode({
          mode: "createBody",
          dragStart: newMouse,
          dragEnd: newMouse,
        });
      }
    },
    [activeMode, mass, interactive]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) {
        return;
      }

      const newMouse = positionFromMouseEvent(e);

      if (activeMode.mode === "createBody") {
        setActiveMode({
          ...activeMode,
          dragEnd: newMouse,
        });
      }
    },
    [activeMode, interactive]
  );

  const onMouseUp = useCallback(() => {
    if (!interactive) {
      return;
    }

    if (activeMode.mode === "createBody") {
      const newBodies = clone(bodies);

      const targetVelocity = mulS(
        subV(activeMode.dragStart, activeMode.dragEnd),
        INITIAL_VELOCITY_COEFF
      );

      const newBody = {
        position: activeMode.dragEnd,
        mass,
        velocity: targetVelocity,
      };

      newBodies.push(newBody);

      setBodies(newBodies);
      setActiveMode({ mode: "simulate" });
      if (randomizeMass) {
        setTargetMass(Math.pow(1000, Math.random()));
      }
    }
  }, [bodies, activeMode, mass, randomizeMass, interactive]);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    onResize();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setStepsPerFrame(10);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setStepsPerFrame(1);
      } else if (e.code === "ArrowDown") {
        setTargetG(targetG - 0.1);
      } else if (e.code === "ArrowUp") {
        setTargetG(targetG + 0.1);
      } else if (e.code === "BracketRight") {
        setTargetMass(clamp(targetMass + 30, 10, 10000));
      } else if (e.code === "BracketLeft") {
        setTargetMass(clamp(targetMass - 30, 10, 10000));
      } else if (e.shiftKey && e.code === "KeyR") {
        setRandomizeMass(!randomizeMass);
      } else if (e.code === "KeyR") {
        setTargetMass(Math.pow(1000, Math.random()));
      }
    };

    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [targetG, targetMass, randomizeMass]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas == null) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (ctx == null) {
      return;
    }

    ctx.fillStyle = primaryColor();
    ctx.fillRect(0, 0, width, height);

    renderBodies(ctx, bodies);

    if (activeMode.mode === "intro") {
      ctx.fillStyle = secondaryColor();
      ctx.textBaseline = "middle";
      ctx.font = "30px charter";
      ctx.textAlign = "center";
      ctx.fillText("Click and Drag", width / 2, height / 2);

      if (width > 600 && height > 800) {
        ctx.fillText("Space → Increase Speed", width / 2, (height / 4) * 3);
        ctx.fillText("R → Randomize Mass", width / 2, (height / 4) * 3 + 40);
        ctx.fillText(
          "Shift + R → Automatically Randomize Mass",
          width / 2,
          (height / 4) * 3 + 80
        );
        ctx.fillText("[ / ] → Adjust Mass", width / 2, (height / 4) * 3 + 120);
        ctx.fillText(
          "Up / Down → Adjust Gravity",
          width / 2,
          (height / 4) * 3 + 160
        );
      }
    }

    if (activeMode.mode === "simulate") {
      window.requestAnimationFrame(() => {
        let computedBodies = bodies;
        for (let i = 0; i < stepsPerFrame; i++) {
          computedBodies = calculateStep(computedBodies, g, width, height);
        }

        setMass(mass + 0.25 * (targetMass - mass));
        setG(g + 0.25 * (targetG - g));
        setBodies(computedBodies);
      });
    } else if (activeMode.mode === "createBody") {
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(activeMode.dragStart[0], activeMode.dragStart[1]);
      ctx.lineTo(activeMode.dragEnd[0], activeMode.dragEnd[1]);
      ctx.stroke();

      drawBody(ctx, {
        position: activeMode.dragEnd,
        mass,
      });
    }

    // Draw UI Bars
    if (interactive) {
      ctx.fillStyle = secondaryColor();
      ctx.fillRect(
        width / 2,
        height - UI_BAR_THICKNESS - UI_BAR_LINE_WIDTH,
        g * 100,
        UI_BAR_THICKNESS
      );
      ctx.fillStyle = randomizeMass ? primaryColor() : secondaryColor();
      ctx.strokeStyle = randomizeMass ? secondaryColor() : primaryColor();
      ctx.lineWidth = 2;
      ctx.fillRect(UI_BAR_LINE_WIDTH, height / 2, UI_BAR_THICKNESS, mass);
      ctx.strokeRect(UI_BAR_LINE_WIDTH, height / 2, UI_BAR_THICKNESS, mass);
    }
  }, [
    canvasRef,
    width,
    height,
    bodies,
    activeMode,
    stepsPerFrame,
    g,
    targetG,
    mass,
    randomizeMass,
    interactive,
  ]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={
          width * (typeof window != "undefined" ? window.devicePixelRatio : 1)
        }
        height={
          height * (typeof window != "undefined" ? window.devicePixelRatio : 1)
        }
        onPointerDown={onMouseDown}
        onPointerMove={onMouseMove}
        onPointerUp={onMouseUp}
        style={{
          touchAction: "none",
          position: "fixed",
          left: "0",
          top: "0",
          zIndex,
        }}
      />
    </div>
  );
}
