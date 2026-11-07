<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { mockActivity } from "./mock-activity";
	import ListPagination from "$lib/components/banking/ListPagination.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import ActivityPanel from "./ActivityPanel.svelte";
	import { currency, type Account } from "./data";
	export let accounts: Account[];
	export let page = 1;
	const perPage = 3;
	$: page = Math.min(Math.max(1, page), Math.max(1, Math.ceil(accounts.length / perPage)));
	$: visibleAccounts = accounts.slice((page - 1) * perPage, page * perPage);
	$: totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
</script>

<div class="columns">
	<div class="accounts-column">
		<Card.Root variant="primary" size="compact" role="region" aria-label="Total balance">
			<Card.Content>
				<div class="balance">
					<Card.Title tag="h1" size="sm">Total balance</Card.Title>
					<strong>{currency(totalBalance)}</strong>
					<Card.Description>Across {accounts.length} accounts</Card.Description>
				</div>
			</Card.Content>
		</Card.Root>

		<section class="accounts">
			<h2>Your accounts</h2>
			<ul>
				{#each visibleAccounts as account (account.id)}
					<li>
						<Card.Root size="compact">
							<Card.Content>
								<div class="row">
									<h3>{account.name}</h3>
									<strong class:negative="{account.balance < 0}">
										{currency(account.balance)}
									</strong>
								</div>
								<div class="row">
									<div class="account-details">
										<span>**** {account.number}</span>
										<Badge variant="secondary">{account.kind}</Badge>
									</div>
									<span class="available">
										{account.status === "ACTIVE"
											? "Available"
											: account.status.charAt(0) + account.status.slice(1).toLowerCase()}
									</span>
								</div>
							</Card.Content>
						</Card.Root>
					</li>
				{/each}
			</ul>

			<ListPagination
				count="{accounts.length}"
				{page}
				{perPage}
				label="Accounts pagination"
				onpagechange="{(next) => (page = next)}"
			/>
		</section>
	</div>

	<ActivityPanel
		title="Recent Activity"
		description="Latest movements across all accounts"
		items="{mockActivity}"
		paginate="{false}"
	/>
</div>

<style>
	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: start;
		gap: var(--s-12);
	}
	.accounts-column {
		display: flex;
		flex-direction: column;
		gap: var(--s-12);
		min-width: 0;
	}
	.balance {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}
	.balance strong {
		font-size: var(--number-fs);
		font-weight: var(--fw-bold);
		line-height: 39px;
	}
	.accounts {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}
	h2 {
		font-weight: var(--fw-medium);
		color: var(--title-fg-ci);
		line-height: 19px;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		line-height: 19px;
	}
	strong {
		font-weight: var(--fw-medium);
		white-space: nowrap;
	}
	.negative {
		color: var(--c-red-dark);
	}
	.account-details {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		font-size: var(--text-sm-fs);
	}
	.available {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
	}
	@media (max-width: 760px) {
		.columns {
			grid-template-columns: 1fr;
			gap: var(--s-6);
		}
		.accounts-column {
			gap: var(--s-6);
		}
	}
	@media (max-width: 380px) {
		h3,
		.row strong {
			font-size: 14px;
		}
		.account-details {
			gap: var(--s-2);
		}
	}
</style>
