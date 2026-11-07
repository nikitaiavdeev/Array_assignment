<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Spinner } from "$lib/components/ui/spinner";
	import { getBankingState } from "./state";
	import { currency } from "./data";
	const { result, submitting, transferDialogOpen, closeTransferDialog, refreshResult } =
		getBankingState();
	$: title = $submitting
		? "Initiating transfer"
		: $result?.success
			? "Transfer Successful"
			: "Transfer Failed";
</script>

<Dialog.Root
	open="{$transferDialogOpen}"
	closeOnEscape="{!$submitting}"
	closeOnOutsideClick="{!$submitting}"
	onOpenChange="{(open) => {
		if (!open) closeTransferDialog();
	}}"
>
	<Dialog.Content
		class="transfer-dialog"
		showClose="{false}"
		style="--dialog-width:calc(100% - 32px);--dialog-max-width:358px;"
	>
		<div
			class="transfer-status"
			class:success="{$result?.success && !$submitting}"
			class:failed="{!$submitting && !$result?.success}"
			aria-hidden="true"
		>
			{#if $submitting}<Spinner label="Initiating transfer" />
			{:else}<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="{$result?.success ? 'm4 12 5 5L20 6' : 'm7 7 10 10M7 17 17 7'}"></path>
				</svg>{/if}
		</div>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{$submitting
					? "Please wait while your transfer is validated, initiated, and confirmed."
					: $result?.success
						? "Your transfer has successfully been completed"
						: $result?.message}
			</Dialog.Description>
		</Dialog.Header>
		{#if !$submitting && $result?.success}
			<dl>
				<div>
					<dt>Amount</dt>
					<dd>{currency($result.amount)}</dd>
				</div>
				<div>
					<dt>Transfer from</dt>
					<dd>{$result.from}</dd>
				</div>
				<div>
					<dt>Transfer to</dt>
					<dd>{$result.to}</dd>
				</div>
				<div>
					<dt>Transfer date</dt>
					<dd>{$result.date}</dd>
				</div>
				<div>
					<dt>Confirmation</dt>
					<dd>{$result.confirmation}</dd>
				</div>
			</dl>
		{/if}
		{#if !$submitting}<Dialog.Footer>
				{#if $result?.uncertain && $result.transferId}<Button
						variant="outline"
						on:click="{() => refreshResult()}"
					>
						Check status
					</Button>{/if}
				<Button variant="outline" on:click="{closeTransferDialog}">
					{$result?.success || $result?.uncertain ? "Close" : "Try again"}
				</Button>
			</Dialog.Footer>{/if}
	</Dialog.Content>
</Dialog.Root>

<style>
	:global(.transfer-dialog.ui-dialog-content) {
		align-items: center;
		gap: var(--s-6);
		padding: var(--s-6);
		box-shadow: var(--shadow-sm);
	}
	.transfer-status {
		width: 64px;
		height: 64px;
		border-radius: var(--radius-round);
		background: var(--c-blue);
		color: var(--c-white);
		display: grid;
		place-items: center;
	}
	.success {
		background: #24956a;
	}
	.failed {
		background: var(--c-red-dark);
	}
	:global(.transfer-dialog .ui-dialog-header) {
		width: 100%;
		align-items: center;
		gap: var(--s-2);
		padding: 0;
		text-align: center;
	}
	:global(.transfer-dialog .ui-dialog-title) {
		font-size: var(--header-xs-fs);
		font-weight: var(--fw-medium);
		line-height: 29px;
	}
	:global(.transfer-dialog .ui-dialog-description) {
		color: var(--c-black);
		line-height: 22px;
	}
	dl {
		width: 100%;
		margin-top: var(--s-6);
		font-size: var(--text-sm-fs);
	}
	dl div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-2) 0;
		border-bottom: 1px solid var(--border-ci);
		line-height: 17px;
	}
	dt {
		flex-shrink: 0;
	}
	dd {
		text-align: right;
		overflow-wrap: anywhere;
		min-width: 0;
	}
	:global(.transfer-dialog .ui-dialog-footer) {
		width: 100%;
		margin-top: var(--s-6);
		flex-direction: column;
	}
	:global(.transfer-dialog .ui-button) {
		width: 100%;
		border-radius: var(--radius);
		min-height: 40px;
	}
</style>
