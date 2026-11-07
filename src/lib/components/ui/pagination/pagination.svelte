<script lang="ts">
	import "./pagination.css";
	import { Pagination as PaginationPrimitive } from "bits-ui";

	import { cn } from "$lib/utils.js";

	type $$Props = PaginationPrimitive.Props;
	// Svelte 4 uses this type for forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = PaginationPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export let count: $$Props["count"] = 0;
	export let perPage: $$Props["perPage"] = 10;
	export let page: $$Props["page"] = 1;
	export let onPageChange: $$Props["onPageChange"] = undefined;
	export let siblingCount: $$Props["siblingCount"] = 1;
	export { className as class };

	$: currentPage = page;
</script>

<PaginationPrimitive.Root
	{onPageChange}
	{count}
	{perPage}
	{siblingCount}
	bind:page
	let:builder
	let:pages
	let:range
	asChild
>
	<nav {...builder} use:builder.action {...$$restProps} class="{cn('ui-pagination', className)}">
		<slot {pages} {range} {currentPage} />
	</nav>
</PaginationPrimitive.Root>

<style>
	:global(.ui-pagination) {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: var(--s-2);
	}
</style>
