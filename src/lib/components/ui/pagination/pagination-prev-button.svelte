<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = PaginationPrimitive.PrevButtonProps;
	// Svelte 4 uses this type for forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = PaginationPrimitive.PrevButtonEvents;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<PaginationPrimitive.PrevButton asChild let:builder>
	<Button
		aria-label="Previous page"
		variant="ghost"
		style="padding-right: 14px; padding-left: 8px;"
		class="{cn('ui-pagination-step', className)}"
		builders="{[builder]}"
		on:click
		{...$$restProps}
	>
		<slot>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="m15 18-6-6 6-6"></path>
			</svg>
			<span>Previous</span>
		</slot>
	</Button>
</PaginationPrimitive.PrevButton>
