<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLSpanElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<span aria-hidden="true" class="{cn('ui-pagination-ellipsis', className)}" {...$$restProps}>
	<span>…</span>
</span>

<style>
	:global(.ui-pagination-ellipsis) {
		display: flex;
		width: 32px;
		height: 36px;
		align-items: center;
		justify-content: center;
		color: var(--text-light-fg-ci);
	}
</style>
