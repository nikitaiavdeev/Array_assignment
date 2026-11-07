import { getContext } from "svelte";
import { get, writable } from "svelte/store";
import { base } from "$app/paths";
import { checkTransferStatus } from "$lib/api/transfer-status";
import { safeFetch } from "$lib/api/safeFetch";
import {
	accountsSchema,
	transfersSchema,
	transferOutcomeSchema,
	transferSchema,
} from "$lib/api/schemas";
import type { Account, Activity } from "./data";
import { transferErrors, type TransferRequest } from "./transfer-validation";
import { mapAccount, mapActivity, createReceipt, type TransferReceipt } from "./mappers";
export const BANKING_CONTEXT = Symbol("banking");
// Each layout has its own stores; API data is never shared between SSR requests.
export function createBankingState() {
	const accounts = writable<Account[]>([]);
	const history = writable<Activity[]>([]);
	const draft = writable({ from: "", to: "", amount: "" });
	const accountsPage = writable(1);
	const historyPage = writable(1);
	const historyTotal = writable(0);
	const historyLoading = writable(false);
	const historyLoaded = writable(false);
	const historyPerPage = 3;
	// Coalesce reads while route mounts or repeated clicks request the same history.
	let historyRequest: Promise<boolean> | undefined;
	function loadHistory(page = get(historyPage)): Promise<boolean> {
		if (historyRequest) return historyRequest;
		const previous = get(historyPage);
		historyPage.set(page);
		historyLoading.set(true);
		historyRequest = (async () => {
			try {
				const response = await safeFetch(
					`${base}/api/transfers?page=${page}&per_page=${historyPerPage}`,
					transfersSchema,
				);
				if (!response.ok) {
					historyPage.set(previous);
					return false;
				}
				history.set(response.data.transfers.map(mapActivity));
				historyTotal.set(response.data.pagination.total);
				historyLoaded.set(true);
				return true;
			} finally {
				historyLoading.set(false);
			}
		})().finally(() => {
			historyRequest = undefined;
		});
		return historyRequest;
	}
	const loading = writable(true);
	const loaded = writable(false);
	const submitting = writable(false);
	const result = writable<TransferReceipt | null>(null);
	const transferDialogOpen = writable(false);
	async function load() {
		if (!get(loaded)) loading.set(true);
		try {
			const accountResponse = await safeFetch(`${base}/api/accounts`, accountsSchema);
			if (!accountResponse.ok) return false;
			accounts.set(accountResponse.data.accounts.map(mapAccount));
			loaded.set(true);
			return true;
		} finally {
			loading.set(false);
		}
	}
	function failure(
		message: string,
		request?: TransferRequest,
		transferId?: string,
		uncertain = false,
	) {
		const current = get(accounts);
		const previous = get(result);
		const name = (id?: string) => {
			const account = current.find((account) => account.id === id);
			return account ? `${account.name}...${account.number}` : "";
		};
		result.set({
			success: false,
			amount: request?.amount ?? previous?.amount ?? 0,
			from: request ? name(request.from) : (previous?.from ?? ""),
			to: request ? name(request.to) : (previous?.to ?? ""),
			date: previous?.date ?? "",
			confirmation: previous?.confirmation ?? "",
			message,
			transferId,
			uncertain,
		});
	}
	async function confirmTransfer(id: string, request?: TransferRequest) {
		const checked = await checkTransferStatus(id, (transferId, timeoutMs) =>
			safeFetch(`${base}/api/transfers/${encodeURIComponent(transferId)}`, transferSchema, {
				timeoutMs,
				// Submission errors belong to TransferDialog, not the global API dialog.
				onError: () => {},
			}),
		);
		if (checked.state === "error") {
			failure(
				checked.timedOut
					? "The transfer status could not be confirmed in time. Check recent transfers before trying again."
					: "The transfer status could not be confirmed. Please check recent transfers before trying again.",
				request,
				id,
				true,
			);
		} else if (checked.state === "pending") {
			failure(
				"The bank is still processing this transfer. Check its status before submitting another transfer.",
				request,
				id,
				true,
			);
		} else {
			result.set(createReceipt(checked.transfer, get(accounts), request, get(result)));
			if (checked.transfer.status === "COMPLETED") draft.set({ from: "", to: "", amount: "" });
		}
	}
	async function transfer(request: TransferRequest) {
		if (get(submitting)) return;
		if (Object.values(transferErrors(request, get(accounts))).some(Boolean)) return;
		submitting.set(true);
		result.set(null);
		transferDialogOpen.set(true);
		try {
			const response = await safeFetch(`${base}/api/transfers`, transferOutcomeSchema, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...request, reference: crypto.randomUUID() }),
				timeoutMs: 30000,
				onError: () => {},
			});
			if (!response.ok) {
				failure(
					response.error.kind === "timeout"
						? "Your transfer could not be confirmed because the request timed out. Check recent transfers before trying again."
						: "Your transfer could not be completed because of an unexpected API error. Check recent transfers before trying again.",
					request,
					undefined,
					true,
				);
				return;
			}
			if (response.data.outcome === "rejected") {
				failure(response.data.message, request);
				return;
			}
			result.set(createReceipt(response.data.transfer, get(accounts), request));
			await confirmTransfer(response.data.transfer.transfer_id, request);
		} finally {
			submitting.set(false);
		}
	}
	async function refreshResult() {
		const id = get(result)?.transferId;
		if (!id || get(submitting)) return;
		submitting.set(true);
		try {
			await confirmTransfer(id);
		} finally {
			submitting.set(false);
		}
	}
	function closeTransferDialog() {
		if (get(submitting)) return;
		transferDialogOpen.set(false);
		if (get(result)?.transferId) {
			void load();
			void loadHistory();
		}
	}

	return {
		accounts,
		history,
		result,
		loading,
		loaded,
		submitting,
		load,
		transfer,
		refreshResult,
		transferDialogOpen,
		closeTransferDialog,
		historyLoaded,
		draft,
		accountsPage,
		historyPage,
		historyTotal,
		historyLoading,
		loadHistory,
	};
}
export function getBankingState() {
	return getContext<ReturnType<typeof createBankingState>>(BANKING_CONTEXT);
}
