<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class="{cn('ui-card-content', className)}" {...$$restProps}>
	<slot />
</div>

<style>
	:global(.ui-card-content) {
		display: flex;
		flex-direction: column;
		gap: var(--card-content-gap, var(--card-gap, var(--s-6)));
		min-width: 0;
	}
</style>
