<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLLIElement>;
	let className: $$Props["class"] = undefined;

	export { className as class };
</script>

<li class="{cn('ui-pagination-item', className)}" {...$$restProps}>
	<slot />
</li>

<style>
	:global(.ui-pagination-item) {
		display: flex;
		align-items: center;
	}
</style>
