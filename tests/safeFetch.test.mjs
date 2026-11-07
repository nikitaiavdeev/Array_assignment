import { test } from "node:test";
import assert from "node:assert/strict";
import * as z from "zod/mini";
import { safeFetch } from "../src/lib/api/safeFetch.ts";
const schema = z.object({ value: z.number() });
const url = "https://example.test/api";
const response = (body) =>
	new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });

test("documented business HTTP errors still require a valid response schema", async () => {
	const result = await safeFetch(url, schema, {
		acceptedStatuses: [400],
		fetcher: async () => new Response(JSON.stringify({ value: 42 }), { status: 400 }),
	});
	assert.deepEqual(result, { ok: true, data: { value: 42 } });
	const invalid = await safeFetch(url, schema, {
		acceptedStatuses: [400],
		onError: () => {},
		fetcher: async () => new Response(JSON.stringify({ value: "wrong" }), { status: 400 }),
	});
	assert.equal(invalid.error.kind, "invalid-response");
});

test("a shared deadline stops the next step before it reaches the upstream API", async () => {
	const controller = new AbortController();
	controller.abort(new DOMException("Deadline exceeded", "TimeoutError"));
	let calls = 0;
	const result = await safeFetch(url, schema, {
		signal: controller.signal,
		onError: () => {},
		fetcher: async () => {
			calls++;
			return response({ value: 1 });
		},
	});
	assert.equal(calls, 0);
	assert.equal(result.error.kind, "timeout");
});
test("returns only validated response data", async () => {
	const result = await safeFetch(url, schema, {
		fetcher: async () => response({ value: 42, extra: "ignored" }),
	});
	assert.deepEqual(result, { ok: true, data: { value: 42 } });
});
test("reports non-success HTTP responses once", async () => {
	const errors = [];
	const result = await safeFetch(url, schema, {
		fetcher: async () => new Response("", { status: 503 }),
		onError: (error) => errors.push(error),
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "http");
	assert.equal(result.error.status, 503);
	assert.equal(errors.length, 1);
});
test("rejects malformed response shapes", async () => {
	const errors = [];
	const result = await safeFetch(url, schema, {
		fetcher: async () => response({ value: "wrong" }),
		onError: (error) => errors.push(error),
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "invalid-response");
	assert.equal(errors.length, 1);
});
test("rejects malformed JSON", async () => {
	const result = await safeFetch(url, schema, {
		fetcher: async () => new Response("not json"),
		onError: () => {},
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "invalid-response");
});
test("handles network failure", async () => {
	const result = await safeFetch(url, schema, {
		fetcher: async () => {
			throw new TypeError("offline");
		},
		onError: () => {},
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "network");
});
test("bounds requests even if the fetcher ignores abort", async () => {
	let signal;
	const errors = [];
	const result = await safeFetch(url, schema, {
		timeoutMs: 20,
		fetcher: (_input, init) => {
			signal = init.signal;
			return new Promise(() => {});
		},
		onError: (error) => errors.push(error),
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "timeout");
	assert.equal(signal.aborted, true);
	assert.equal(errors.length, 1);
});
test("bounds reading a stalled response body", async () => {
	const result = await safeFetch(url, schema, {
		timeoutMs: 20,
		fetcher: async () => ({ ok: true, json: () => new Promise(() => {}) }),
		onError: () => {},
	});
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "timeout");
});
test("cancellation aborts without showing an unexpected-error notification", async () => {
	const controller = new AbortController();
	const errors = [];
	const pending = safeFetch(url, schema, {
		signal: controller.signal,
		fetcher: () => new Promise(() => {}),
		onError: (error) => errors.push(error),
	});
	controller.abort();
	const result = await pending;
	assert.equal(result.ok, false);
	assert.equal(result.error.kind, "aborted");
	assert.equal(errors.length, 0);
});
test("clears the timeout after a successful response", async () => {
	let signal;
	const result = await safeFetch(url, schema, {
		timeoutMs: 20,
		fetcher: async (_input, init) => {
			signal = init.signal;
			return response({ value: 1 });
		},
	});
	await new Promise((resolve) => setTimeout(resolve, 30));
	assert.equal(result.ok, true);
	assert.equal(signal.aborted, false);
});
