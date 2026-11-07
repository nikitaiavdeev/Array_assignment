<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SelectPrimitive.SeparatorProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Separator class="{cn('ui-select-separator', className)}" {...$$restProps} />

<style>
	:global(.ui-select-separator) {
		height: 1px;
		margin: var(--s-1) 0;
		background: var(--border-ci);
	}
</style>
