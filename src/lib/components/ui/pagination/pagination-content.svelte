<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLUListElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<ul class="{cn('ui-pagination-content', className)}" {...$$restProps}>
	<slot />
</ul>

<style>
	:global(.ui-pagination-content) {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--s-1);
	}
</style>
