<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class="{cn('ui-card-header', className)}" {...$$restProps}>
	<slot />
</div>

<style>
	:global(.ui-card-header) {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}
</style>
