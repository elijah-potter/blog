import { ReactNode, useEffect, useRef } from "react";
import styles from "./OrbitAnimation.module.css";

export default function OrbitAnimation({
  width,
  height,
  children,
}: {
  width: string;
  height: string;
  children: ReactNode;
}) {
  const elements = [];

  const count = 50;

  for (let i = 0; i < count; i++) {
    const r = (i / count) * Math.PI * 2;

    elements.push(
      <circle
        key={i}
        cx={(Math.cos(r) * 49).toFixed(6)}
        cy={(Math.sin(r) * 49).toFixed(6)}
        r="1"
        fill="var(--fg)"
      />
    );
  }

  return (
    <div className={styles.parent}>
      {children}
      <svg
        width={width}
        height={height}
        viewBox="-50 -50 100 100"
        className={styles.spinner}
      >
        {elements}
      </svg>
    </div>
  );
}
