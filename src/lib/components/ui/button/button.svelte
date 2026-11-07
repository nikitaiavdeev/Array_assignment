<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Events, type Props, buttonVariants } from "./index.js";

	type $$Props = Props;
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class="{buttonVariants({ variant, size, className })}"
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>

<style>
	:global(.ui-button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-2);
		min-height: 42px;
		padding: var(--s-3) var(--s-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
		background: transparent;
		transition: background 0.15s;
	}
	:global(.ui-button--default) {
		background: var(--c-blue);
		color: var(--c-white);
	}
	:global(.ui-button--default:hover) {
		background: var(--c-blue-dark);
	}
	:global(.ui-button--outline) {
		border: 1px solid var(--border-ci);
		background: var(--c-white);
	}
	:global(.ui-button--secondary) {
		background: var(--c-gray-light);
	}
	:global(.ui-button--destructive) {
		background: var(--c-red-dark);
		color: var(--c-white);
	}
	:global(.ui-button--ghost:hover),
	:global(.ui-button--outline:hover) {
		background: var(--c-gray-lighter);
	}
	:global(.ui-button--link) {
		color: var(--c-blue);
		text-decoration: underline;
	}
	:global(.ui-button--size-sm) {
		min-height: 36px;
		padding: 8px 12px;
	}
	:global(.ui-button--size-lg) {
		min-height: 48px;
		padding: 12px 32px;
	}
	:global(.ui-button--size-icon) {
		width: 42px;
		padding: 8px;
	}
</style>
