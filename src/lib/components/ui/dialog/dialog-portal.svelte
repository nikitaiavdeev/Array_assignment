<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	// Svelte 4 uses this type for the forwarded portal attributes.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = DialogPrimitive.PortalProps;
</script>

<DialogPrimitive.Portal {...$$restProps}>
	<slot />
</DialogPrimitive.Portal>
