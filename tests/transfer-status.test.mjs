import { test } from "node:test";
import assert from "node:assert/strict";
import { checkTransferStatus } from "../src/lib/api/transfer-status.ts";
import { SafeFetchError } from "../src/lib/api/safeFetch.ts";
const clock = () => {
	let now = 0;
	return {
		timeoutMs: 3000,
		intervalMs: 1000,
		maxIntervalMs: 1000,
		now: () => now,
		delay: async (ms) => {
			now += ms;
		},
	};
};

test("status polling backs off under load while keeping its total deadline", async () => {
	let now = 0;
	const delays = [];
	const result = await checkTransferStatus(
		"id",
		async () => ({ ok: true, data: { status: "PENDING" } }),
		{
			now: () => now,
			delay: async (ms) => {
				delays.push(ms);
				now += ms;
			},
		},
	);
	assert.equal(result.state, "pending");
	assert.deepEqual(delays.slice(0, 4), [1000, 2000, 4000, 5000]);
	assert.equal(now, 30000);
	assert.ok(delays.every((ms) => ms <= 5000));
});
test("status is checked even when initiation reports completed", async () => {
	let reads = 0;
	const result = await checkTransferStatus(
		"id",
		async () => {
			reads++;
			return { ok: true, data: { status: "COMPLETED" } };
		},
		clock(),
	);
	assert.equal(reads, 1);
	assert.equal(result.state, "settled");
});
test("polls GET status until a pending transfer completes", async () => {
	const states = ["PENDING", "PROCESSING", "COMPLETED"];
	let reads = 0;
	const result = await checkTransferStatus(
		"id",
		async () => ({ ok: true, data: { status: states[reads++] } }),
		clock(),
	);
	assert.equal(reads, 3);
	assert.equal(result.transfer.status, "COMPLETED");
});
test("a failed bank status is terminal", async () => {
	let reads = 0;
	const result = await checkTransferStatus(
		"id",
		async () => {
			reads++;
			return { ok: true, data: { status: "FAILED" } };
		},
		clock(),
	);
	assert.equal(reads, 1);
	assert.equal(result.transfer.status, "FAILED");
});
test("a status API failure is returned without retrying", async () => {
	let reads = 0;
	const result = await checkTransferStatus(
		"id",
		async () => {
			reads++;
			return { ok: false, error: new SafeFetchError("network") };
		},
		clock(),
	);
	assert.equal(reads, 1);
	assert.deepEqual(result, { state: "error", timedOut: false });
});
test("pending status cannot poll forever or become false success", async () => {
	let reads = 0;
	const result = await checkTransferStatus(
		"id",
		async () => {
			reads++;
			return { ok: true, data: { status: "PROCESSING" } };
		},
		clock(),
	);
	assert.equal(reads, 3);
	assert.equal(result.state, "pending");
});

// The API returns empty source account numbers on some pending records.
test("pending response accepts an unavailable source number", async () => {
	const z = await import("zod/mini");
	const { transferSchema } = await import("../src/lib/api/schemas.ts");
	const parsed = z.safeParse(transferSchema, {
		transfer_id: "id",
		status: "PENDING",
		amount: 1,
		currency: "USD",
		reference_number: "ref",
		direction: "OUTBOUND",
		transfer_type: "ACH",
		source_account: { account_number: "" },
		destination_account: { account_number: "destination" },
		initiated_date: "2026-11-07T12:00:00Z",
	});
	assert.equal(parsed.success, true);
});
