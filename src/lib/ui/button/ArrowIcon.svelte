<script lang="ts">
	export let isBordered: boolean = true;
</script>

<span class="icon" class:isBordered>
	<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M6 2.99993L1.5 5.59801L1.5 0.401855L6 2.99993Z" />
	</svg>
</span>

<style>
	.isBordered {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		box-shadow: 0 0 0 1px inset var(--text-color-40);
		border-radius: 100px;
		transition: linear 180ms box-shadow;
	}
	svg {
		display: block;
		fill: var(--text-color);
	}
	:global(.btn:hover) .isBordered {
		box-shadow: 0 0 0 1px inset var(--text-color);
	}
	@media (min-width: 720px) {
		.isBordered {
			width: 36px;
			height: 36px;
		}
	}
</style>
