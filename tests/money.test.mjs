import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeMoneyInput, formatMoneyInput } from "../src/lib/money.ts";
test("money display groups thousands without rounding cents", () => {
	assert.equal(formatMoneyInput("1234567.89"), "1,234,567.89");
});
test("formatted currency pastes become canonical API values", () => {
	assert.equal(normalizeMoneyInput("$ 001,234.50"), "1234.50");
});
test("money editing preserves empty and incomplete decimal values", () => {
	assert.equal(normalizeMoneyInput(""), "");
	assert.equal(formatMoneyInput("1234."), "1,234.");
	assert.equal(normalizeMoneyInput(".5"), "0.5");
});
test("money rejects excess precision and exponent input", () => {
	assert.equal(normalizeMoneyInput("1.234"), null);
	assert.equal(normalizeMoneyInput("1e3"), null);
});
test("negative amounts stay negative so validation can reject them", () => {
	assert.equal(normalizeMoneyInput("-1,234.50"), "-1234.50");
	assert.equal(formatMoneyInput("-1234.50"), "-1,234.50");
});
