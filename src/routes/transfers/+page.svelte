<script lang="ts">
	import { onMount } from "svelte";
	import TransferDialog from "$lib/components/banking/TransferDialog.svelte";
	import TransfersView from "$lib/components/banking/TransfersView.svelte";
	import { getBankingState } from "$lib/components/banking/state";
	import type { TransferRequest } from "$lib/components/banking/transfer-validation";
	const {
		accounts,
		history,
		transfer,
		submitting,
		draft,
		historyPage,
		historyTotal,
		historyLoading,
		loadHistory,
		historyLoaded,
	} = getBankingState();
	async function submit(event: CustomEvent<TransferRequest>) {
		await transfer(event.detail);
	}
	onMount(() => {
		if (!$historyLoaded) void loadHistory();
	});
</script>

<svelte:head><title>Transfers | NorthWind</title></svelte:head>
<TransfersView
	accounts="{$accounts}"
	bind:from="{$draft.from}"
	bind:to="{$draft.to}"
	bind:amount="{$draft.amount}"
	history="{$history}"
	historyPage="{$historyPage}"
	historyTotal="{$historyTotal}"
	historyLoading="{$historyLoading}"
	onhistorypagechange="{(page) => {
		void loadHistory(page);
	}}"
	busy="{$submitting}"
	on:transfer="{submit}"
/>

<TransferDialog />
