<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import * as Dialog from "./index.js";
	import { cn, flyAndScale } from "$lib/utils.js";

	type $$Props = DialogPrimitive.ContentProps & { showClose?: boolean };
	export let showClose = true;

	let className: $$Props["class"] = undefined;
	export let transition: $$Props["transition"] = flyAndScale;
	export let transitionConfig: $$Props["transitionConfig"] = {
		duration: 200,
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class="{cn('ui-dialog-content', className)}"
		{...$$restProps}
	>
		<slot />
		{#if showClose}<DialogPrimitive.Close class="dialog-close" aria-label="Close dialog">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="m6 6 12 12M6 18 18 6"></path>
				</svg>
			</DialogPrimitive.Close>{/if}
	</DialogPrimitive.Content>
</Dialog.Portal>

<style>
	:global(.ui-dialog-content) {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: var(--dialog-width, calc(100% - var(--s-8)));
		max-width: var(--dialog-max-width, 512px);
		max-height: calc(100dvh - var(--s-8));
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
		padding: var(--s-6);
		background: var(--c-white);
		color: var(--text-fg-ci);
		border: 1px solid var(--border-ci);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-lg);
		z-index: var(--layer-5);
	}
	:global(.dialog-close) {
		position: absolute;
		right: var(--s-4);
		top: var(--s-4);
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: var(--radius);
		color: var(--text-light-fg-ci);
	}
	:global(.dialog-close:hover) {
		background: var(--c-gray-light);
		color: var(--text-fg-ci);
	}
</style>
