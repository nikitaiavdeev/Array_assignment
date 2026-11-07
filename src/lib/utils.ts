import { type ClassValue, clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = (params.y ?? 5) * (1 - t);
			const x = (params.x ?? 0) * (1 - t);
			const start = params.start ?? 0.95;
			const scale = start + (1 - start) * t;
			return `transform: ${transform} translate3d(${x}px, ${y}px, 0) scale(${scale}); opacity: ${t};`;
		},
		easing: cubicOut,
	};
};
