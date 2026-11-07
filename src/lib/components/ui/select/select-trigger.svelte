<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SelectPrimitive.TriggerProps & { chevron?: "down" | "right" };
	export let chevron: $$Props["chevron"] = "down";
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class="{cn('ui-select-trigger', className)}"
	{...$$restProps}
	let:builder
	on:click
	on:keydown
>
	<slot {builder} />
	<div>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="{chevron === 'right' ? 'm9 6 6 6-6 6' : 'm6 9 6 6 6-6'}"></path>
		</svg>
	</div>
</SelectPrimitive.Trigger>

<style>
	:global(.ui-select-trigger) {
		display: flex;
		width: 100%;
		min-height: var(--select-height);
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		padding: var(--select-padding);
		border: var(--select-border-size) solid var(--select-border-ci);
		border-radius: var(--select-radius);
		background: var(--select-bg-ci);
		font-size: var(--select-fs);
	}
	:global(.ui-select-trigger[aria-invalid="true"]) {
		border-color: var(--input-error-border-ci);
		background: var(--input-error-bg-ci);
	}
	:global(.ui-select-trigger[data-placeholder]) {
		color: var(--select-placeholder-fg-ci);
	}
	svg {
		flex-shrink: 0;
		color: var(--text-light-fg-ci);
	}
</style>
