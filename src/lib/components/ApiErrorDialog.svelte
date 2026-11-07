<script lang="ts">
	import { onMount } from "svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { API_ERROR_EVENT, type SafeFetchError } from "$lib/api/safeFetch";
	let open = false;
	let timedOut = false;

	onMount(() => {
		const show = (event: Event) => {
			timedOut = (event as CustomEvent<SafeFetchError>).detail.kind === "timeout";
			open = true;
		};
		window.addEventListener(API_ERROR_EVENT, show);
		return () => window.removeEventListener(API_ERROR_EVENT, show);
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Unexpected API error</Dialog.Title>
			<Dialog.Description>
				{timedOut
					? "The API took too long to respond."
					: "The API encountered an unexpected error."}
				Please contact the developers for help.
			</Dialog.Description>
		</Dialog.Header>
		<p>
			If you were submitting a transfer, check recent transfers before trying again. The request may
			still have been processed.
		</p>
		<Dialog.Footer><Button on:click="{() => (open = false)}">Close</Button></Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	p {
		font-size: var(--text-sm-fs);
		line-height: 1.5;
	}
</style>
