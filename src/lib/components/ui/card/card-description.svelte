<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLParagraphElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<p class="{cn('ui-card-description', className)}" {...$$restProps}>
	<slot />
</p>

<style>
	:global(.ui-card-description) {
		font-size: var(--text-sm-fs);
		color: var(--card-muted-color, var(--text-light-fg-ci));
		line-height: 1.3;
	}
</style>
