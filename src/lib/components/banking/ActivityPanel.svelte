<script lang="ts">
	import ListPagination from "$lib/components/banking/ListPagination.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Spinner } from "$lib/components/ui/spinner";
	import * as Card from "$lib/components/ui/card";
	import { currency, type Activity } from "./data";
	export let title: string;
	export let description: string;
	export let items: Activity[];
	export let page = 1;
	export let total = items.length;
	export let loading = false;
	export let paginate = true;
	export let onpagechange: (page: number) => void = () => {};
</script>

<Card.Root variant="muted" role="region" aria-label="{title}" aria-busy="{loading}">
	<Card.Header>
		<div class="panel-title">
			<Card.Title tag="h2">{title}</Card.Title>{#if loading}<Spinner
					label="Loading transfers"
				/>{/if}
		</div>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if loading}<div class="placeholders" aria-hidden="true">
				{#each ["first", "second", "third"] as row (row)}<Skeleton style="height:40px" />{/each}
			</div>{:else}
			<ul>
				{#each items as item (item.id)}
					<li>
						<span class="icon"><img src="{item.icon}" alt="" /></span>
						<div class="details">
							<h3>{item.name}</h3>
							<p>{item.detail}</p>
						</div>

						<strong class:positive="{item.amount > 0}" class:negative="{item.amount < 0}">
							{item.amount > 0 ? "+" : ""}{currency(item.amount)}
						</strong>
					</li>
				{:else}<li>No recent activity.</li>{/each}
			</ul>{/if}
	</Card.Content>
	{#if paginate && total > 3}
		<Card.Footer>
			<ListPagination
				count="{total}"
				{page}
				label="{`${title} pagination`}"
				disabled="{loading}"
				{onpagechange}
			/>
		</Card.Footer>
	{/if}
</Card.Root>

<style>
	.panel-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
	}
	.placeholders {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}
	p {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		line-height: 1.25;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}
	li {
		display: flex;
		align-items: flex-start;
		gap: 15px;
		min-height: 40px;
	}
	.icon {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		border: 1px solid var(--border-ci);
		border-radius: var(--radius-round);
		background: var(--c-gray-light);
		display: grid;
		place-items: center;
	}
	img {
		width: 16px;
		height: 16px;
	}
	.details {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}
	h3 {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		line-height: 1.3;
	}
	strong {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		white-space: nowrap;
		line-height: 1.3;
	}
	.positive {
		color: var(--c-green-dark);
	}
	.negative {
		color: var(--c-red-dark);
	}
	@media (max-width: 480px) {
		li {
			gap: var(--s-2);
		}
		.details p {
			font-size: 12px;
		}
		strong {
			font-size: 13px;
		}
	}
</style>
