<script lang="ts">
	export let isBordered: boolean = true;
	export let direction: 'left' | 'right' | 'up' | 'down' = 'right';

	$: rotation =
		direction === 'left' ? 180 : direction === 'up' ? -90 : direction === 'down' ? 90 : 0;
</script>

<span class="icon" class:isBordered>
	<svg
		width="6"
		height="7"
		viewBox="0 0 6 7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style="transform: rotate({rotation}deg);"
	>
		<path d="M6 3.5L0 7L2.71011e-07 0L6 3.5Z" />
	</svg>
</span>

<style>
	.isBordered {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		box-shadow: 0 0 0 1px inset var(--text-color-40);
		border-radius: 100px;
		transition: linear 180ms box-shadow;
	}
	svg {
		display: block;
		fill: var(--text-color);
		width: 4.5px;
		height: 5.25px;
	}
	:global(.btn:hover) .isBordered {
		box-shadow: 0 0 0 1px inset var(--text-color);
	}
	@media (min-width: 720px) {
		.isBordered {
			width: 32px;
			height: 32px;
		}
		svg {
			width: 6px;
			height: 7px;
		}
	}
</style>
