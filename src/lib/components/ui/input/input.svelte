<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { InputEvents } from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLInputAttributes;
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = InputEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined;
</script>

<input
	class="{cn('ui-input', className)}"
	bind:value
	{readonly}
	on:blur
	on:change
	on:click
	on:focus
	on:focusin
	on:focusout
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:mousemove
	on:paste
	on:input
	on:wheel|passive
	{...$$restProps}
/>

<style>
	:global(.ui-input) {
		display: block;
		width: 100%;
		height: var(--input-height);
		padding: var(--input-padding);
		border: var(--input-border-size) solid var(--input-border-ci);
		border-radius: var(--input-radius);
		background: var(--input-bg-ci);
		color: var(--input-fg-ci);
		font-size: var(--input-fs);
	}
	:global(.ui-input[aria-invalid="true"]) {
		border-color: var(--input-error-border-ci);
		background: var(--input-error-bg-ci);
	}
</style>
