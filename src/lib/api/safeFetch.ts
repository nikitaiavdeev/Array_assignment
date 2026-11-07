import * as z from "zod/mini";

export type ApiErrorKind = "http" | "timeout" | "network" | "invalid-response" | "aborted";
export class SafeFetchError extends Error {
	readonly kind: ApiErrorKind;
	readonly status?: number;
	constructor(kind: ApiErrorKind, status?: number) {
		super(`API request failed: ${kind}`);
		this.name = "SafeFetchError";
		this.kind = kind;
		this.status = status;
	}
}
export type SafeFetchResult<T> = { ok: true; data: T } | { ok: false; error: SafeFetchError };
export type SafeFetchOptions = RequestInit & {
	/** Business rejections may use non-2xx responses, but must still pass the schema. */
	acceptedStatuses?: readonly number[];
	timeoutMs?: number;
	fetcher?: typeof fetch;
	onError?: (error: SafeFetchError) => void;
};
export const API_ERROR_EVENT = "northwind:api-error";
function showApiError(error: SafeFetchError) {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: error }));
	}
}

/** Validates JSON responses and bounds the entire request, including reading the body.
 * Does not retry: a timed-out POST may already have changed remote state.
 */
export async function safeFetch<S extends z.ZodMiniType>(
	input: RequestInfo | URL,
	validator: S,
	options: SafeFetchOptions = {},
): Promise<SafeFetchResult<z.output<S>>> {
	const {
		timeoutMs = 15000,
		fetcher = fetch,
		onError = showApiError,
		signal,
		acceptedStatuses = [],
		...init
	} = options;
	const controller = new AbortController();
	let timer: ReturnType<typeof setTimeout> | undefined;
	let timedOut = false;
	let cancel = () => {};
	try {
		if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new SafeFetchError("timeout");
		const deadline = new Promise<never>((_, reject) => {
			timer = setTimeout(() => {
				timedOut = true;
				reject(new SafeFetchError("timeout"));
				controller.abort();
			}, timeoutMs);
		});
		const cancellation = new Promise<never>((_, reject) => {
			cancel = () => {
				timedOut = signal?.reason?.name === "TimeoutError";
				reject(new SafeFetchError(timedOut ? "timeout" : "aborted"));
				controller.abort(signal?.reason);
			};
			if (signal?.aborted) cancel();
			else signal?.addEventListener("abort", cancel, { once: true });
		});
		const request = async () => {
			if (signal?.aborted) throw new SafeFetchError("aborted");
			const response = await fetcher(input, { ...init, signal: controller.signal });
			if (!response.ok && !acceptedStatuses.includes(response.status)) {
				void response.body?.cancel().catch(() => {});
				throw new SafeFetchError(
					response.status === 408 || response.status === 504 ? "timeout" : "http",
					response.status,
				);
			}
			let payload: unknown;
			try {
				payload = await response.json();
			} catch {
				throw new SafeFetchError("invalid-response");
			}
			const parsed = z.safeParse(validator, payload);
			if (!parsed.success) throw new SafeFetchError("invalid-response");
			return parsed.data;
		};
		return { ok: true, data: await Promise.race([request(), deadline, cancellation]) };
	} catch (cause) {
		const error = timedOut
			? new SafeFetchError("timeout")
			: cause instanceof SafeFetchError
				? cause
				: new SafeFetchError("network");
		if (error.kind !== "aborted") onError(error);
		return { ok: false, error };
	} finally {
		clearTimeout(timer);
		signal?.removeEventListener("abort", cancel);
	}
}
