import { type RefCallback, useCallback, useRef, useState } from "react";
import type { Vector } from "../vector";

export default function useSize(): [RefCallback<HTMLElement>, Vector] {
	const elementRef = useRef<HTMLElement | null>(null);
	const [size, setSize] = useState<Vector>([100, 100]);

	if (typeof window === "undefined") {
		return [() => undefined, size];
	}

	const [ro] = useState(
		new ResizeObserver(() => {
			if (elementRef.current != null) {
				setSize([
					elementRef.current.offsetWidth,
					elementRef.current.offsetHeight,
				]);
			}
		}),
	);

	const setRef = useCallback((element: HTMLElement) => {
		if (elementRef.current != null) {
			ro.unobserve(elementRef.current);
		}

		if (element == null) {
			return;
		}

		ro.observe(element);

		setSize([element.offsetWidth, element.offsetHeight]);

		elementRef.current = element;
	}, []);

	return [setRef, size];
}
