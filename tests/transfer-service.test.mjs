import { test } from "node:test";
import assert from "node:assert/strict";
import { executeTransfer } from "../src/lib/server/transfer-service.ts";
import { SafeFetchError } from "../src/lib/api/safeFetch.ts";

const command = { from: "source", to: "destination", amount: 25, reference: "reference" };
const account = (id) => ({
	account_id: id,
	account_number: `number-${id}`,
	routing_number: "routing",
	account_holder_name: "Fixture",
	account_status: "ACTIVE",
	balance: 100,
});
function fixture({ valid = true, failAt, initiationRejects = false, balance = 100 } = {}) {
	const calls = [];
	const error = { ok: false, error: new SafeFetchError("timeout") };
	return {
		calls,
		error,
		api: {
			accounts: async () => {
				calls.push("accounts");
				return failAt === "accounts"
					? error
					: {
							ok: true,
							data: { accounts: [{ ...account("source"), balance }, account("destination")] },
						};
			},
			request: async (path, _schema, options) => {
				calls.push(path);
				const body = JSON.parse(options.body);
				assert.equal(body.source_account.account_number, "number-source");
				assert.equal(body.reference_number, command.reference);
				assert.equal(body.amount, command.amount);
				if (path.endsWith(failAt)) return error;
				return {
					ok: true,
					data:
						path.endsWith("validate") || initiationRejects
							? {
									validation: {
										valid: initiationRejects ? false : valid,
										issues: [{ message: "Account limit exceeded." }],
									},
								}
							: { transfer_id: "fixture-transfer", status: "PENDING" },
				};
			},
		},
	};
}
test("server validates before initiating exactly once using canonical account details", async () => {
	const f = fixture();
	const result = await executeTransfer(command, f.api);
	assert.deepEqual(f.calls, [
		"accounts",
		"/external/transfers/validate",
		"/external/transfers/initiate",
	]);
	assert.equal(result.data.outcome, "accepted");
});
test("validation rejection stops initiation and preserves the bank's explanation", async () => {
	const f = fixture({ valid: false });
	const result = await executeTransfer(command, f.api);
	assert.equal(result.data.outcome, "rejected");
	assert.equal(result.data.message, "Account limit exceeded.");
	assert.equal(f.calls.length, 2);
});
test("stale balance or identical accounts are rejected before upstream validation", async () => {
	for (const options of [{ balance: 1 }, {}]) {
		const f = fixture(options);
		const result = await executeTransfer(
			options.balance ? command : { ...command, to: command.from },
			f.api,
		);
		assert.equal(result.data.outcome, "rejected");
		assert.deepEqual(f.calls, ["accounts"]);
	}
});
test("each failed upstream step stops the workflow without retrying initiation", async () => {
	for (const [failAt, calls] of [
		["accounts", 1],
		["validate", 2],
		["initiate", 3],
	]) {
		const f = fixture({ failAt });
		assert.equal(await executeTransfer(command, f.api), f.error);
		assert.equal(f.calls.length, calls);
	}
});
test("initiation can return a bank validation rejection without false success", async () => {
	const f = fixture({ initiationRejects: true });
	// Only initiation rejects; validation succeeds.
	const request = f.api.request;
	f.api.request = (path, schema, options) =>
		path.endsWith("validate")
			? Promise.resolve({ ok: true, data: { validation: { valid: true } } })
			: request(path, schema, options);
	assert.equal((await executeTransfer(command, f.api)).data.outcome, "rejected");
});
