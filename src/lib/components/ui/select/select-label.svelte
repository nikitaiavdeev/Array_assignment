<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SelectPrimitive.LabelProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Label class="{cn('ui-select-label', className)}" {...$$restProps}>
	<slot />
</SelectPrimitive.Label>

<style>
	:global(.ui-select-label) {
		padding: 8px 12px 8px 32px;
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
	}
</style>
