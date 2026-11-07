<script lang="ts">
	import "../app.css";

	import { setContext, onMount } from "svelte";
	import { page } from "$app/stores";
	import { base } from "$app/paths";
	import BankingSkeleton from "$lib/components/banking/BankingSkeleton.svelte";
	import { Spinner } from "$lib/components/ui/spinner";
	import ApiErrorDialog from "$lib/components/ApiErrorDialog.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import logo from "$lib/assets/logo.svg";
	import { BANKING_CONTEXT, createBankingState } from "$lib/components/banking/state";

	const banking = createBankingState();
	setContext(BANKING_CONTEXT, banking);
	const { loading, loaded, load, historyLoading } = banking;
	onMount(() => {
		void load();
	});

	$: transfersActive = $page.url.pathname.startsWith(`${base}/transfers`);
</script>

<svelte:head>
	<meta name="description" content="NorthWind accounts and internal transfers" />
</svelte:head>
<main class="banking-app" aria-busy="{$loading}">
	<Card.Root size="spacious">
		<header class="app-header">
			<a href="{`${base}/accounts`}" aria-label="NorthWind home">
				<img src="{logo}" alt="NorthWind" width="148" height="24" />
			</a>
			<nav aria-label="Main navigation">
				<a
					href="{`${base}/accounts`}"
					class:active="{!transfersActive}"
					aria-current="{!transfersActive ? 'page' : undefined}"
				>
					Accounts
				</a>
				<a
					href="{`${base}/transfers`}"
					class:active="{transfersActive}"
					aria-current="{transfersActive ? 'page' : undefined}"
				>
					Transfers
				</a>
			</nav>
		</header>
		{#if $loading}<BankingSkeleton transfers="{transfersActive}" />
		{:else if !$loaded}<Card.Root variant="muted">
				<Card.Header>
					<Card.Title tag="h1">Unable to load your accounts</Card.Title><Card.Description>
						Please contact the developers if this problem continues.
					</Card.Description>
				</Card.Header><Card.Footer>
					<Button on:click="{() => load()}">Try again</Button>
				</Card.Footer>
			</Card.Root>
		{:else}{#if $historyLoading}<div class="refresh-status">
					<Spinner label="Refreshing account data" />
					<span>Refreshing...</span>
				</div>{/if}<slot />{/if}
	</Card.Root>
</main>
<ApiErrorDialog />

<style>
	.refresh-status {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
	}
	.banking-app {
		max-width: 1120px;
		margin: clamp(24px, 14.5vh, 149px) auto 48px;
	}
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-6);
		min-height: 24px;
	}
	.app-header > a {
		flex-shrink: 0;
	}
	.app-header img {
		width: 148px;
		height: 24px;
	}
	nav {
		display: flex;
		gap: var(--s-6);
	}
	nav a {
		color: var(--text-light-fg-ci);
		font-weight: var(--fw-medium);
		font-size: var(--text-fs);
	}
	nav a.active {
		color: var(--c-blue);
	}
	@media (max-width: 1168px) {
		.banking-app {
			margin-left: var(--s-6);
			margin-right: var(--s-6);
		}
	}
	@media (max-width: 760px) {
		.banking-app {
			margin: 0;
			min-height: 100dvh;
			background: var(--c-white);
		}
		.banking-app > :global(.ui-card) {
			--card-radius: 0;
			border: 0;
		}
		.app-header {
			flex-wrap: wrap;
			row-gap: var(--s-6);
		}
	}
	@media (max-width: 380px) {
		nav {
			gap: var(--s-4);
		}
		nav a {
			font-size: 14px;
		}
		.app-header img {
			width: 130px;
			height: auto;
		}
	}
</style>
