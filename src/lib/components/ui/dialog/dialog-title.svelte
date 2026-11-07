<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = DialogPrimitive.TitleProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Title class="{cn('ui-dialog-title', className)}" {...$$restProps}>
	<slot />
</DialogPrimitive.Title>

<style>
	:global(.ui-dialog-title) {
		font-size: var(--title-lg-fs);
		font-weight: var(--fw-semi-bold);
		line-height: 1.3;
	}
</style>
