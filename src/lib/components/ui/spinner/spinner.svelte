<script lang="ts">
	export let label = "Loading";
</script>

<span class="spinner" role="status" aria-label="{label}">
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".25"></circle>
		<path
			d="M12 3a9 9 0 0 1 9 9"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
		></path>
	</svg>
</span>

<style>
	.spinner {
		display: inline-flex;
		flex-shrink: 0;
		color: inherit;
	}
	svg {
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		svg {
			animation: none;
		}
	}
</style>
