import * as z from "zod/mini";
import {
	accountsSchema,
	transferSchema,
	validationSchema,
	type TransferCommand,
	type TransferOutcome,
} from "../api/schemas.ts";
import type { SafeFetchOptions, SafeFetchResult } from "../api/safeFetch.ts";

type Dependencies = {
	accounts: () => Promise<SafeFetchResult<z.output<typeof accountsSchema>>>;
	request: <S extends z.ZodMiniType>(
		path: string,
		schema: S,
		options: SafeFetchOptions,
	) => Promise<SafeFetchResult<z.output<S>>>;
};

/** The upstream bank owns atomic balance checks. Never retry initiation after an unknown outcome. */
export async function executeTransfer(
	command: TransferCommand,
	api: Dependencies,
): Promise<SafeFetchResult<TransferOutcome>> {
	const response = await api.accounts();
	if (!response.ok) return response;
	const { from, to, amount, reference } = command;
	const source = response.data.accounts.find((account) => account.account_id === from);
	const destination = response.data.accounts.find((account) => account.account_id === to);
	const rejected = (message: string) => ({
		ok: true as const,
		data: { outcome: "rejected" as const, message },
	});
	if (
		!source ||
		!destination ||
		from === to ||
		source.account_status !== "ACTIVE" ||
		destination.account_status !== "ACTIVE" ||
		amount > source.balance
	) {
		return rejected("Choose two active accounts and an amount within your available balance.");
	}
	const details = (account: typeof source) => ({
		account_number: account.account_number,
		routing_number: account.routing_number,
		account_holder_name: account.account_holder_name,
		institution_name: "Northwind Bank",
	});
	const body = JSON.stringify({
		source_account: details(source),
		destination_account: details(destination),
		amount,
		currency: "USD",
		description: "Transfer between accounts",
		direction: "OUTBOUND",
		transfer_type: "ACH",
		reference_number: reference,
	});
	const options = { method: "POST", body, acceptedStatuses: [400] };
	const validation = await api.request("/external/transfers/validate", validationSchema, options);
	if (!validation.ok) return validation;
	const message = (data: z.output<typeof validationSchema>) =>
		data.validation.issues?.map((issue) => issue.message).join(" ") ||
		"The bank could not approve this transfer.";
	if (!validation.data.validation.valid) return rejected(message(validation.data));
	// Initiation can also return a documented validation rejection (HTTP 400).
	const initiated = await api.request(
		"/external/transfers/initiate",
		z.union([transferSchema, validationSchema]),
		options,
	);
	if (!initiated.ok) return initiated;
	if ("validation" in initiated.data) return rejected(message(initiated.data));
	return { ok: true, data: { outcome: "accepted", transfer: initiated.data } };
}
