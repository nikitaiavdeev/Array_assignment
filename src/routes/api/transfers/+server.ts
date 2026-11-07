import * as z from "zod/mini";
import { transfersSchema, transferRequestSchema } from "$lib/api/schemas";
import {
	northwind,
	apiFailure,
	apiResponse,
	configured,
	fetchAccounts,
} from "$lib/server/northwind";
import { executeTransfer } from "$lib/server/transfer-service";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, url }) => {
	if (!configured()) return apiFailure(503);
	const page = Number(url.searchParams.get("page") ?? 1);
	const perPage = Number(url.searchParams.get("per_page") ?? 3);
	if (
		!Number.isSafeInteger(page) ||
		page < 1 ||
		!Number.isSafeInteger(perPage) ||
		perPage < 1 ||
		perPage > 100
	)
		return apiFailure(400);
	const response = await northwind(
		`/external/transfers?per_page=${perPage}&page=${page}`,
		transfersSchema,
		fetch,
	);
	return apiResponse(response);
};

export const POST: RequestHandler = async ({ fetch, request, url }) => {
	// Transfers originate from this app; credentials remain on the server.
	if (request.headers.get("origin") !== url.origin) return apiFailure(403);
	if (!configured()) return apiFailure(503);
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return apiFailure(400);
	}

	const parsed = z.safeParse(transferRequestSchema, body);
	if (!parsed.success) return apiFailure(400);
	// One deadline covers account loading, validation, and initiation (browser: 30s).
	const signal = AbortSignal.any([request.signal, AbortSignal.timeout(24000)]);
	return apiResponse(
		await executeTransfer(parsed.data, {
			accounts: () => fetchAccounts(fetch, signal),
			request: (path, schema, options) => northwind(path, schema, fetch, { ...options, signal }),
		}),
	);
};
