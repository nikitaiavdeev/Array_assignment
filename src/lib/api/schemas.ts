import * as z from "zod/mini";
const text = () => z.string().check(z.minLength(1));
const money = () => z.number();
const timestamp = () => z.iso.datetime({ offset: true });
const paginationSchema = z.object({
	total: z.number().check(z.int(), z.minimum(0)),
	page: z.number().check(z.int(), z.minimum(1)),
	per_page: z.number().check(z.int(), z.minimum(1)),
});
export const accountSchema = z.object({
	account_id: text(),
	account_number: text(),
	routing_number: text(),
	account_type: text(),
	account_status: text(),
	account_holder_name: text(),
	balance: money(),
	currency: z.literal("USD"),
});
export const accountsSchema = z.object({
	accounts: z.array(accountSchema),
	pagination: paginationSchema,
});
const accountDetails = z.object({
	// Pending API records can omit the account number until processing finishes.
	account_number: z.string(),
	account_holder_name: z.optional(z.string()),
	routing_number: z.optional(z.string()),
	institution_name: z.optional(z.string()),
});
export const transferSchema = z.object({
	transfer_id: text(),
	status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED", "REVERSED"]),
	amount: money(),
	currency: z.literal("USD"),
	reference_number: text(),
	direction: z.enum(["INBOUND", "OUTBOUND"]),
	transfer_type: text(),
	source_account: accountDetails,
	destination_account: accountDetails,
	initiated_date: timestamp(),
	completed_date: z.optional(z.string()),
	description: z.optional(z.string()),
	error_message: z.optional(z.string()),
});
export const transfersSchema = z.object({
	transfers: z.array(transferSchema),
	pagination: paginationSchema,
});
export const validationSchema = z.object({
	validation: z.object({
		valid: z.boolean(),
		issues: z.optional(
			z.array(
				z.object({
					message: text(),
					code: z.optional(z.string()),
					field: z.optional(z.string()),
					severity: z.optional(z.string()),
				}),
			),
		),
	}),
});
export const transferRequestSchema = z.object({
	from: text(),
	to: text(),
	amount: money().check(z.minimum(0.01), z.multipleOf(0.01)),
	reference: text().check(z.maxLength(100)),
});
export const transferOutcomeSchema = z.union([
	z.object({ outcome: z.literal("accepted"), transfer: transferSchema }),
	z.object({ outcome: z.literal("rejected"), message: text() }),
]);
export type TransferOutcome = z.output<typeof transferOutcomeSchema>;
export type TransferCommand = z.output<typeof transferRequestSchema>;
export type ApiAccount = z.output<typeof accountSchema>;
export type ApiTransfer = z.output<typeof transferSchema>;
