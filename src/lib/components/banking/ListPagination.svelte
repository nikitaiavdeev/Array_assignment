<script lang="ts">
	import * as Pagination from "$lib/components/ui/pagination";
	export let count: number;
	export let page = 1;
	export let perPage = 3;
	export let label: string;
	export let disabled = false;
	export let onpagechange: (page: number) => void = () => {};
	$: totalPages = Math.max(1, Math.ceil(count / perPage));
</script>

{#if totalPages > 1}
	<Pagination.Root
		{count}
		{perPage}
		{page}
		siblingCount="{0}"
		onPageChange="{(next) => {
			if (!disabled) onpagechange(next);
		}}"
		aria-label="{label}"
		let:pages
		let:currentPage
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton disabled="{disabled || page <= 1}" />
			</Pagination.Item>

			{#each pages as entry (entry.key)}
				<Pagination.Item>
					{#if entry.type === "ellipsis"}<Pagination.Ellipsis />
					{:else}<Pagination.Link
							page="{entry}"
							isActive="{currentPage === entry.value}"
							{disabled}
						/>{/if}
				</Pagination.Item>
			{/each}

			<Pagination.Item>
				<Pagination.NextButton disabled="{disabled || page >= totalPages}" />
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
{/if}
