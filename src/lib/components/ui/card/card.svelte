<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: "default" | "muted" | "primary" | "plain";
		size?: "default" | "compact" | "spacious";
	};
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div
	class="{cn('ui-card', className)}"
	data-variant="{variant}"
	data-size="{size}"
	{...$$restProps}
>
	<slot />
</div>

<style>
	:global(.ui-card) {
		--card-padding: var(--s-4);
		--card-gap: var(--s-6);
		--card-radius: var(--radius-xl);
		--card-background: var(--c-white);
		--card-color: var(--text-fg-ci);
		--card-muted-color: var(--text-light-fg-ci);
		--card-border: var(--border-ci);
		display: flex;
		flex-direction: column;
		gap: var(--card-gap, var(--s-6));
		min-width: 0;
		padding: var(--card-padding, var(--s-4));
		background: var(--card-background, var(--c-white));
		color: var(--card-color, var(--text-fg-ci));
		border: 1px solid var(--card-border, var(--border-ci));
		border-radius: var(--card-radius, var(--radius-xl));
	}
	:global(.ui-card[data-variant="muted"]) {
		--card-background: var(--c-gray-lighter);
	}
	:global(.ui-card[data-variant="primary"]) {
		--card-background: var(--c-blue);
		--card-color: var(--c-white);
		--card-muted-color: var(--c-white);
		--card-border: var(--c-blue);
	}
	:global(.ui-card[data-variant="plain"]) {
		background: transparent;
		border: 0;
		padding: 0;
	}
	:global(.ui-card[data-size="compact"]) {
		--card-gap: var(--s-2);
		--card-radius: var(--radius-lg);
	}
	:global(.ui-card[data-size="spacious"]) {
		--card-padding: var(--s-6);
	}
	@media (max-width: 760px) {
		:global(.ui-card[data-size="spacious"]) {
			--card-padding: var(--s-4);
		}
	}
</style>
