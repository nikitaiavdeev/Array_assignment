<script lang="ts">
	import AccountsView from "$lib/components/banking/AccountsView.svelte";
	import { getBankingState } from "$lib/components/banking/state";
	const { accounts, accountsPage } = getBankingState();
</script>

<svelte:head><title>Accounts | NorthWind</title></svelte:head>
<AccountsView accounts="{$accounts}" bind:page="{$accountsPage}" />
