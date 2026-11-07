<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Field } from "$lib/components/ui/field";
	import AccountSelect from "./AccountSelect.svelte";
	import { Spinner } from "$lib/components/ui/spinner";
	import { MoneyInput } from "$lib/components/ui/money-input";
	import ActivityPanel from "./ActivityPanel.svelte";
	import { currency, type Account, type Activity } from "./data";
	import { transferErrors, isValidTransferAmount } from "./transfer-validation";
	export let accounts: Account[];
	export let history: Activity[] = [];
	export let busy = false;
	export let historyPage = 1;
	export let historyTotal = 0;
	export let historyLoading = false;
	export let onhistorypagechange: (page: number) => void = () => {};
	const dispatch = createEventDispatcher<{
		transfer: { from: string; to: string; amount: number };
	}>();
	export let from = "";
	export let to = "";
	export let amount = "";
	let submitted = false;
	let touched = { from: false, to: false, amount: false };
	$: if (!from && !to && !amount) {
		submitted = false;
		touched = { from: false, to: false, amount: false };
	}
	$: source = accounts.find((account) => account.id === from);
	$: destination = accounts.find((account) => account.id === to);
	$: numericAmount = Number(amount);
	$: errors = transferErrors({ from, to, amount: numericAmount }, accounts);
	$: validAmount = isValidTransferAmount(numericAmount);
	$: canSubmit = !Object.values(errors).some(Boolean);
	function submit() {
		submitted = true;
		if (!canSubmit || busy) return;
		dispatch("transfer", { from, to, amount: numericAmount });
	}
</script>

<div class="columns">
	<Card.Root role="region" aria-labelledby="transfer-heading">
		<Card.Header>
			<Card.Title tag="h1" id="transfer-heading">Transfer between accounts</Card.Title>
			<Card.Description>Move money instantly between your accounts.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form aria-busy="{busy}" novalidate on:submit|preventDefault="{submit}">
				<Field
					id="from"
					label="Transfer from"
					description="{source ? `${currency(source.balance)} available` : ''}"
					error="{submitted || touched.from ? errors.from : ''}"
					let:controlProps
				>
					<AccountSelect
						{...controlProps}
						disabled="{busy}"
						{accounts}
						on:blur="{() => (touched.from = true)}"
						bind:value="{from}"
						excluded="{to}"
						sourceOnly
					/>
				</Field>
				<Field
					id="to"
					label="Transfer to"
					description="{destination ? `${currency(destination.balance)} available` : ''}"
					error="{submitted || touched.to ? errors.to : ''}"
					let:controlProps
				>
					<AccountSelect
						{...controlProps}
						disabled="{busy}"
						{accounts}
						on:blur="{() => (touched.to = true)}"
						bind:value="{to}"
						excluded="{from}"
					/>
				</Field>
				<Field
					id="amount"
					label="Amount"
					error="{submitted || touched.amount ? errors.amount : ''}"
					on:focusout="{() => (touched.amount = true)}"
					let:controlProps
				>
					<MoneyInput {...controlProps} disabled="{busy}" bind:value="{amount}" required />
				</Field>
				<p class="authorization">
					By continuing, I authorize Northwind Bank to transfer money as indicated
				</p>
				<Card.Footer>
					<Button type="submit" style="width:100%" disabled="{!canSubmit || busy}">
						{#if busy}<Spinner label="Submitting transfer" />{/if}{busy
							? "Submitting..."
							: "Complete Transfer"}
					</Button>
				</Card.Footer>
			</form>
		</Card.Content>
	</Card.Root>

	<div class="sidebar">
		<Card.Root variant="muted" role="region" aria-label="Transfer summary">
			<Card.Header>
				<Card.Title tag="h2">Transfer summary</Card.Title>
				<Card.Description>
					A quick view of how this transfer affects your balances.
				</Card.Description>
			</Card.Header>

			<Card.Content>
				<div class="summary-accounts" aria-live="polite">
					<div>
						<p class="direction">{validAmount ? currency(numericAmount) + " " : ""}From</p>
						<h3>{source?.name ?? "–"}</h3>
						{#if source}<p>
								{validAmount ? "New balance" : "Current"} · {currency(
									source.balance - (validAmount ? numericAmount : 0),
								)}
							</p>{/if}
					</div>
					<div>
						<p class="direction">{validAmount ? currency(numericAmount) + " " : ""}To</p>
						<h3>{destination?.name ?? "–"}</h3>
						{#if destination}<p>
								{validAmount ? "New balance" : "Current"} · {currency(
									destination.balance + (validAmount ? numericAmount : 0),
								)}
							</p>{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<ActivityPanel
			title="Recent transfers"
			description="Quick reference of your latest internal transfers."
			items="{history}"
			page="{historyPage}"
			total="{historyTotal}"
			loading="{historyLoading}"
			onpagechange="{onhistorypagechange}"
		/>
	</div>
</div>

<style>
	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-12);
		align-items: start;
	}
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
		min-width: 0;
	}
	p {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		line-height: 1.3;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}
	.authorization {
		text-align: center;
		font-size: 12px;
	}

	.summary-accounts {
		display: flex;
		flex-direction: row;
		gap: var(--s-6);
	}
	.summary-accounts > div {
		width: 50%;
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}
	.direction {
		color: var(--text-light-fg-ci);
	}
	h3 {
		font-size: var(--text-fs);
		font-weight: var(--fw-medium);
	}
	@media (max-width: 760px) {
		.columns {
			grid-template-columns: 1fr;
			gap: var(--s-6);
		}
	}
</style>
