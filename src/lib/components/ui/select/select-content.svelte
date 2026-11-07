<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { scale } from "svelte/transition";
	import { cn, flyAndScale } from "$lib/utils.js";

	type $$Props = SelectPrimitive.ContentProps;
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = SelectPrimitive.ContentEvents;

	export let sideOffset: $$Props["sideOffset"] = 4;
	export let inTransition: $$Props["inTransition"] = flyAndScale;
	export let inTransitionConfig: $$Props["inTransitionConfig"] = undefined;
	export let outTransition: $$Props["outTransition"] = scale;
	export let outTransitionConfig: $$Props["outTransitionConfig"] = {
		start: 0.95,
		opacity: 0,
		duration: 50,
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Content
	{inTransition}
	{inTransitionConfig}
	{outTransition}
	{outTransitionConfig}
	{sideOffset}
	class="{cn('ui-select-content', className)}"
	{...$$restProps}
	on:keydown
>
	<div class="select-options">
		<slot />
	</div>
</SelectPrimitive.Content>

<style>
	:global(.ui-select-content) {
		position: relative;
		min-width: 8rem;
		overflow: hidden;
		padding: var(--s-1);
		background: var(--c-white);
		color: var(--text-fg-ci);
		border: 1px solid var(--border-ci);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}
</style>
