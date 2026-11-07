<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { HeadingLevel } from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
		size?: "sm" | "default" | "lg";
	};

	let className: $$Props["class"] = undefined;
	export let tag: $$Props["tag"] = "h3";
	export let size: $$Props["size"] = "default";
	export { className as class };
</script>

<svelte:element
	this="{tag}"
	data-size="{size}"
	class="{cn('ui-card-title', className)}"
	{...$$restProps}
>
	<slot />
</svelte:element>

<style>
	:global(.ui-card-title) {
		font-size: var(--title-fs);
		font-weight: var(--fw-medium);
		line-height: 1.2;
	}
	:global(.ui-card-title[data-size="sm"]) {
		font-size: var(--text-sm-fs);
	}
	:global(.ui-card-title[data-size="lg"]) {
		font-size: var(--header-xs-fs);
	}
</style>
