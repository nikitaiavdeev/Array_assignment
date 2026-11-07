<script lang="ts">
	import { tick } from "svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { Input } from "$lib/components/ui/input";
	import { normalizeMoneyInput, formatMoneyInput } from "$lib/money";
	// Svelte 4 uses this type for forwarded input attributes.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<HTMLInputAttributes, "value"> & { value?: string };
	export let value = "";
	$: display = formatMoneyInput(value);
	async function input(event: Event) {
		const element = event.target as HTMLInputElement;
		const position = element.selectionStart ?? element.value.length;
		const before = element.value.slice(0, position).replace(/[^\d.-]/g, "").length;
		const normalized = normalizeMoneyInput(element.value);
		if (normalized === null) {
			element.value = display;
			return;
		}
		value = normalized;
		await tick();
		element.value = display;
		// Keep the caret at the same digit when grouping commas are inserted or removed.
		let offset = 0,
			seen = 0;
		while (offset < element.value.length && seen < before) {
			if (element.value[offset] !== ",") seen++;
			offset++;
		}
		element.setSelectionRange(offset, offset);
	}
	function blur() {
		if (value && value !== "-" && Number.isFinite(Number(value))) value = Number(value).toFixed(2);
	}
</script>

<div class="money-input">
	<span aria-hidden="true">$</span>
	<Input
		{...$$restProps}
		value="{display}"
		type="text"
		inputmode="decimal"
		placeholder="0.00"
		on:input="{input}"
		on:blur="{blur}"
	/>
</div>

<style>
	.money-input {
		position: relative;
	}
	span {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-light-fg-ci);
	}
	.money-input :global(input) {
		padding-left: 30px;
		border-radius: var(--radius-md);
		font-variant-numeric: tabular-nums;
	}
</style>
