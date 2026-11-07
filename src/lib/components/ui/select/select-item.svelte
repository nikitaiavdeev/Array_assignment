<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SelectPrimitive.ItemProps;
	// Svelte 4 uses this type to expose forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = SelectPrimitive.ItemEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"];
	export let label: $$Props["label"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class="{cn('ui-select-item', className)}"
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	<span class="item-indicator">
		<SelectPrimitive.ItemIndicator>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="m5 12 4 4L19 6"></path>
			</svg>
		</SelectPrimitive.ItemIndicator>
	</span>
	<slot>
		{label || value}
	</slot>
</SelectPrimitive.Item>

<style>
	:global(.ui-select-item) {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		padding: 8px 12px 8px 32px;
		font-size: var(--text-sm-fs);
		border-radius: var(--radius);
		outline: none;
		cursor: default;
	}
	:global(.ui-select-item[data-highlighted]) {
		background: var(--c-blue-lightest);
	}
	:global(.ui-select-item[data-disabled]) {
		opacity: 0.5;
		pointer-events: none;
	}
	.item-indicator {
		position: absolute;
		left: 8px;
		display: flex;
		align-items: center;
	}
</style>
