<script lang="ts">
	import { type Variant, badgeVariants } from "./index.js";
	import { cn } from "$lib/utils.js";

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = "default";
	export { className as class };
</script>

<svelte:element
	this="{href ? 'a' : 'span'}"
	{href}
	class="{cn(badgeVariants({ variant, className }))}"
	{...$$restProps}
>
	<slot />
</svelte:element>

<style>
	.ui-badge {
		display: inline-flex;
		align-items: center;
		padding: 4px 8px;
		border-radius: var(--radius-md);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		background: var(--c-gray-lighter);
	}
	.ui-badge--default {
		background: var(--c-blue);
		color: var(--c-white);
	}
	.ui-badge--destructive {
		background: var(--c-red-lighter);
		color: var(--c-red-dark);
	}
	.ui-badge--outline {
		border: 1px solid var(--border-ci);
		background: transparent;
	}
</style>
