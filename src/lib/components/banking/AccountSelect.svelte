<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import * as Select from "$lib/components/ui/select";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import type { Account } from "./data";
	// Svelte 4 uses this type to declare forwarded trigger attributes.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = HTMLButtonAttributes & {
		accounts: Account[];
		value?: string;
		excluded?: string;
		sourceOnly?: boolean;
	};
	export let accounts: Account[];
	export let value = "";
	export let excluded = "";
	export let sourceOnly = false;
	const dispatch = createEventDispatcher<{ blur: void }>();
	$: account = accounts.find((account) => account.id === value);
	// Bits UI 0.22 ignores undefined selections; an empty selection clears the trigger.
	$: selected = account
		? { value: account.id, label: `${account.name}...${account.number}` }
		: { value: "", label: "Choose account" };
</script>

<Select.Root
	onOpenChange="{(open) => {
		if (!open) dispatch('blur');
	}}"
	{selected}
	onSelectedChange="{(selection) => {
		value = selection?.value ?? '';
	}}"
>
	<Select.Trigger
		{...$$restProps}
		class="account-select"
		data-placeholder="{account ? undefined : ''}"
		chevron="right"
	>
		<Select.Value placeholder="Choose account" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each accounts as account (account.id)}
				<Select.Item
					value="{account.id}"
					label="{`${account.name}...${account.number}`}"
					disabled="{account.id === excluded ||
						account.status !== 'ACTIVE' ||
						(sourceOnly && account.balance <= 0)}"
				/>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<style>
	:global(.account-select) {
		--select-placeholder-fg-ci: var(--c-blue);
		--select-padding: var(--s-4);
		--select-radius: var(--radius-xl);
		--select-border-ci: var(--border-ci);
		--select-height: 51px;
		line-height: 19px;
	}
</style>
