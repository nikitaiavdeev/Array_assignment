<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { Spinner } from "$lib/components/ui/spinner";
	export let transfers = false;
</script>

<div class="loading">
	<Spinner label="Loading your accounts" />
	<span>Loading your accounts...</span>
</div>

<div class="columns" aria-hidden="true">
	<Card.Root>
		<Card.Header>
			<Skeleton style="width:55%;height:20px" /><Skeleton style="width:85%" />
		</Card.Header><Card.Content>
			{#each ["first", "second", "third"] as row (row)}
				<Skeleton style="{transfers ? 'height:72px' : 'height:85px'}" />
			{/each}
		</Card.Content>
	</Card.Root>
	<Card.Root variant="muted">
		<Card.Header>
			<Skeleton style="width:50%;height:20px" /><Skeleton style="width:80%" />
		</Card.Header>
		<Card.Content>
			{#each ["first", "second", "third"] as row (row)}
				<Skeleton style="height:40px" />
			{/each}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.loading {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
	}
	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-12);
	}
	@media (max-width: 760px) {
		.columns {
			grid-template-columns: 1fr;
			gap: var(--s-6);
		}
	}
</style>
