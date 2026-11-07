import bank from "$lib/assets/bank.svg";
import type { ApiAccount, ApiTransfer } from "$lib/api/schemas";
import type { Account, Activity } from "./data";
import type { TransferRequest } from "./transfer-validation";

export type TransferReceipt = {
	success: boolean;
	amount: number;
	from: string;
	to: string;
	date: string;
	confirmation: string;
	transferId?: string;
	message: string;
	uncertain?: boolean;
};

const accountName = (account: ApiAccount) =>
	account.account_type === "CD"
		? "CD account"
		: `${account.account_type.charAt(0)}${account.account_type.slice(1).toLowerCase()} account`;
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const formatDate = (date: string) => dateFormatter.format(new Date(date));
export function mapAccount(account: ApiAccount): Account {
	return {
		id: account.account_id,
		name: accountName(account),
		number: account.account_number.slice(-4),
		balance: account.balance,
		kind: account.account_type,
		status: account.account_status,
	};
}
export function mapActivity(transfer: ApiTransfer): Activity {
	return {
		id: transfer.transfer_id,
		name: transfer.description || `Transfer ${transfer.reference_number}`,
		detail: `${formatDate(transfer.initiated_date)} · ${transfer.status.toLowerCase()}`,
		amount: transfer.direction === "OUTBOUND" ? -transfer.amount : transfer.amount,
		icon: bank,
	};
}

export function createReceipt(
	transfer: ApiTransfer,
	current: Account[],
	request?: TransferRequest,
	previous?: TransferReceipt | null,
): TransferReceipt {
	const name = (number: string, accountId?: string, previousName?: string) => {
		// Keep the selected account names when a pending API record has no account number.
		const account = current.find((account) =>
			accountId ? account.id === accountId : Boolean(number) && account.number === number.slice(-4),
		);
		return account
			? `${account.name}...${account.number}`
			: number
				? `Account...${number.slice(-4)}`
				: (previousName ?? "Not provided");
	};
	const pending = ["PENDING", "PROCESSING"].includes(transfer.status);
	return {
		success: transfer.status === "COMPLETED",
		amount: transfer.amount,
		from: name(transfer.source_account.account_number, request?.from, previous?.from),
		to: name(transfer.destination_account.account_number, request?.to, previous?.to),
		date: formatDate(transfer.completed_date || transfer.initiated_date),
		confirmation: transfer.reference_number,
		transferId: transfer.transfer_id,
		message:
			transfer.error_message ||
			(pending
				? "The bank is processing your transfer. Check its status before submitting another transfer."
				: "The bank could not complete this transfer."),
	};
}
