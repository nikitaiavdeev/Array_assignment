<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = DialogPrimitive.DescriptionProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Description class="{cn('ui-dialog-description', className)}" {...$$restProps}>
	<slot />
</DialogPrimitive.Description>

<style>
	:global(.ui-dialog-description) {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		line-height: 1.5;
	}
</style>
