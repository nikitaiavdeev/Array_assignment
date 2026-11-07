import type { ApiTransfer } from "./schemas";
import type { SafeFetchResult } from "./safeFetch";
type StatusResult =
	{ state: "settled" | "pending"; transfer: ApiTransfer } | { state: "error"; timedOut: boolean };
/** Only status GETs are repeated; validation and initiation are never retried. */
export async function checkTransferStatus(
	id: string,
	read: (id: string, timeoutMs: number) => Promise<SafeFetchResult<ApiTransfer>>,
	{
		timeoutMs = 30000,
		intervalMs = 1000,
		maxIntervalMs = 5000,
		now = Date.now,
		delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
	} = {},
): Promise<StatusResult> {
	const deadline = now() + timeoutMs;
	let waitMs = intervalMs;
	let last: ApiTransfer | undefined;
	while (now() < deadline) {
		const response = await read(id, Math.min(8000, deadline - now()));
		if (!response.ok) return { state: "error", timedOut: response.error.kind === "timeout" };
		last = response.data;
		if (!["PENDING", "PROCESSING"].includes(last.status))
			return { state: "settled", transfer: last };
		const remaining = deadline - now();
		if (remaining > 0) await delay(Math.min(waitMs, remaining));
		// Long-running transfers should not create one request per second per active user.
		waitMs = Math.min(waitMs * 2, maxIntervalMs);
	}
	return last ? { state: "pending", transfer: last } : { state: "error", timedOut: true };
}
