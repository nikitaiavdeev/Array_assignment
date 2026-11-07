<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { type Props, buttonVariants } from "$lib/components/ui/button/index.js";

	type $$Props = PaginationPrimitive.PageProps &
		Props & {
			isActive: boolean;
		};

	// Svelte 4 uses this type for forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = PaginationPrimitive.PageEvents;

	let className: $$Props["class"] = undefined;
	export let page: $$Props["page"];
	export let size: $$Props["size"] = "icon";
	export let isActive: $$Props["isActive"] = false;

	export { className as class };
</script>

<PaginationPrimitive.Page
	bind:page
	aria-current="{isActive ? 'page' : undefined}"
	class="{cn(
		'ui-pagination-link',
		buttonVariants({
			variant: 'ghost',
			size,
		}),
		className,
	)}"
	{...$$restProps}
	on:click
>
	<slot>{page.value}</slot>
</PaginationPrimitive.Page>
