<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div aria-hidden="true" class="{cn('ui-skeleton', className)}" {...$$restProps}></div>

<style>
	.ui-skeleton {
		width: var(--skeleton-width, 100%);
		height: var(--skeleton-height, 1rem);
		border-radius: var(--radius-md);
		background: var(--c-gray-light);
		animation: pulse 1.5s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.45;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ui-skeleton {
			animation: none;
		}
	}
</style>
