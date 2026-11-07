<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = PaginationPrimitive.NextButtonProps;
	// Svelte 4 uses this type for forwarded component events.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = PaginationPrimitive.NextButtonEvents;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<PaginationPrimitive.NextButton asChild let:builder>
	<Button
		aria-label="Next page"
		variant="ghost"
		style="padding-right: 8px; padding-left: 14px;"
		class="{cn('ui-pagination-step', className)}"
		builders="{[builder]}"
		on:click
		{...$$restProps}
	>
		<slot>
			<span>Next</span>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="m9 6 6 6-6 6"></path>
			</svg>
		</slot>
	</Button>
</PaginationPrimitive.NextButton>
