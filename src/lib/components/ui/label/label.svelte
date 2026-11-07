<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = LabelPrimitive.Props;
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = LabelPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root class="{cn('ui-label', className)}" {...$$restProps} on:mousedown>
	<slot />
</LabelPrimitive.Root>

<style>
	:global(.ui-label) {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
	}
</style>
