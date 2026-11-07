<script lang="ts">
	import { Label } from "$lib/components/ui/label";
	export let id: string;
	export let label: string;
	export let description = "";
	export let error = "";
	$: describedBy =
		[description ? `${id}-description` : "", error ? `${id}-error` : ""]
			.filter(Boolean)
			.join(" ") || undefined;
	$: controlProps = {
		id,
		"aria-invalid": error ? (true as const) : undefined,
		"aria-describedby": describedBy,
	};
</script>

<div class="field" data-invalid="{error ? '' : undefined}" on:focusout>
	<Label for="{id}">{label}</Label>
	<slot {controlProps} />
	{#if description}<p id="{`${id}-description`}" class="description">{description}</p>{/if}
	{#if error}<p id="{`${id}-error`}" class="error" role="alert">{error}</p>{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		min-width: 0;
	}
	.description {
		color: var(--text-light-fg-ci);
		font-size: 13px;
		line-height: 1.3;
	}
	.error {
		color: var(--c-red-dark);
		font-size: var(--text-sm-fs);
		line-height: 1.3;
	}
	.field[data-invalid] :global(.ui-label) {
		color: var(--c-red-dark);
	}
</style>
