import type { Account } from "./data";

export type TransferRequest = { from: string; to: string; amount: number };

export function isValidTransferAmount(amount: number) {
	return (
		Number.isFinite(amount) &&
		amount > 0 &&
		Math.abs(amount * 100 - Math.round(amount * 100)) < 0.00001
	);
}

/** Shared by field feedback and the submission guard so they cannot disagree. */
export function transferErrors(request: TransferRequest, accounts: Account[]) {
	const source = accounts.find((account) => account.id === request.from);
	const destination = accounts.find((account) => account.id === request.to);
	const { amount } = request;
	return {
		from: !source
			? "Choose an account to transfer from."
			: source.status !== "ACTIVE"
				? "Choose an active account."
				: "",
		to: !destination
			? "Choose an account to transfer to."
			: destination.status !== "ACTIVE"
				? "Choose an active account."
				: request.from === request.to
					? "Choose a different destination account."
					: "",
		amount: !isValidTransferAmount(amount)
			? "Enter an amount greater than zero, with up to two decimal places."
			: source && amount > source.balance
				? "The amount exceeds your available balance."
				: "",
	};
}
