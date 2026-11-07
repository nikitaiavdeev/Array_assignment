import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type * as z from "zod/mini";
import {
	safeFetch,
	type SafeFetchError,
	type SafeFetchOptions,
	type SafeFetchResult,
} from "$lib/api/safeFetch";
import { accountsSchema } from "$lib/api/schemas";

const API_URL = "https://northwind.dev.array.io";

export function northwind<S extends z.ZodMiniType>(
	path: string,
	schema: S,
	fetcher: typeof fetch,
	init: SafeFetchOptions = {},
) {
	const started = performance.now();
	return safeFetch(`${API_URL}${path}`, schema, {
		...init,
		fetcher,
		timeoutMs: 8000,
		onError: (error) => {
			const operation = path
				.split("?")[0]
				.replace(/\/external\/transfers\/(?!validate$|initiate$)[^/]+$/, "/external/transfers/:id");
			console.error(
				JSON.stringify({
					event: "upstream_failed",
					operation,
					kind: error.kind,
					status: error.status,
					durationMs: Math.round(performance.now() - started),
				}),
			);
		},
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${env.NORTHWIND_API_KEY ?? ""}`,
			...init.headers,
		},
	});
}

export function apiFailure(cause: number | SafeFetchError = 502) {
	const status = typeof cause === "number" ? cause : cause.kind === "timeout" ? 504 : 502;

	return json(
		{ error: "The API encountered an unexpected error. Please contact the developers." },
		{ status, headers: { "Cache-Control": "no-store" } },
	);
}

export function configured() {
	return Boolean(env.NORTHWIND_API_KEY);
}

export const privateHeaders = { "Cache-Control": "no-store" };

/** Keep upstream error translation and private response headers consistent across routes. */
export function apiResponse<T>(response: SafeFetchResult<T>) {
	return response.ok
		? json(response.data, { headers: privateHeaders })
		: apiFailure(response.error);
}

/** Account choices and transfer validation must use the same complete account list. */
export async function fetchAccounts(fetcher: typeof fetch, signal = AbortSignal.timeout(10000)) {
	const first = await northwind("/external/accounts?limit=100&offset=0", accountsSchema, fetcher, {
		signal,
	});
	if (!first.ok) return first;
	const accounts = [...first.data.accounts];
	for (let offset = 100; offset < first.data.pagination.total; offset += 100) {
		const next = await northwind(
			`/external/accounts?limit=100&offset=${offset}`,
			accountsSchema,
			fetcher,
			{ signal },
		);
		if (!next.ok) return next;
		accounts.push(...next.data.accounts);
	}
	return { ok: true as const, data: { ...first.data, accounts } };
}
