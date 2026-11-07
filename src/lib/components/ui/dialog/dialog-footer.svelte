<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class="{cn('ui-dialog-footer', className)}" {...$$restProps}>
	<slot />
</div>

<style>
	:global(.ui-dialog-footer) {
		display: flex;
		justify-content: flex-end;
		gap: var(--s-3);
	}
	@media (max-width: 480px) {
		.ui-dialog-footer {
			flex-direction: column;
		}
	}
</style>
