<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class="{cn('ui-card-footer', className)}" {...$$restProps}>
	<slot />
</div>

<style>
	:global(.ui-card-footer) {
		display: flex;
		align-items: center;
		gap: var(--s-3);
	}
</style>
