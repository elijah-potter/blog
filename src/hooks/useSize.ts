import { Vector } from "../vector";
import { RefCallback, useCallback, useRef, useState } from "react";

export default function (): [RefCallback<HTMLElement>, Vector] {
  const elementRef = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState<Vector>([100, 100]);

  if (typeof window === "undefined") {
    return [() => null, size];
  }

  const [ro] = useState(
    new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize([r.width, r.height]);
    })
  );

  const setRef = useCallback((element: HTMLElement) => {
    if (elementRef.current != null) {
      ro.unobserve(elementRef.current);
    }

    if (element == null) {
      return;
    }

    ro.observe(element);

    const computedStyle = window.getComputedStyle(element);

    const computedSize: Vector = [
      parseFloat(computedStyle.width),
      parseFloat(computedStyle.height),
    ];

    setSize(computedSize);

    elementRef.current = element;
  }, []);

  return [setRef, size];
}
