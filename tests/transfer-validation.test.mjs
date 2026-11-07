import { test } from "node:test";
import assert from "node:assert/strict";
import { transferErrors } from "../src/lib/components/banking/transfer-validation.ts";

const accounts = [
	{ id: "checking", status: "ACTIVE", balance: 100 },
	{ id: "savings", status: "ACTIVE", balance: 50 },
	{ id: "closed", status: "CLOSED", balance: 100 },
];
const request = { from: "checking", to: "savings", amount: 10.01 };

test("a valid cent amount within the available balance can be submitted", () => {
	assert.deepEqual(transferErrors(request, accounts), { from: "", to: "", amount: "" });
});

test("missing, inactive, and identical accounts cannot be used", () => {
	assert.ok(transferErrors({ ...request, from: "" }, accounts).from);
	assert.ok(transferErrors({ ...request, to: "closed" }, accounts).to);
	assert.ok(transferErrors({ ...request, to: "checking" }, accounts).to);
});

test("invalid precision, non-finite, and non-positive amounts cannot be submitted", () => {
	for (const amount of [0, -1, NaN, Infinity, 1.001]) {
		assert.ok(transferErrors({ ...request, amount }, accounts).amount);
	}
});

test("the full balance is valid but exceeding it is rejected", () => {
	assert.equal(transferErrors({ ...request, amount: 100 }, accounts).amount, "");
	assert.ok(transferErrors({ ...request, amount: 100.01 }, accounts).amount);
});
