<script lang="ts">
	export let vimeoId: number;
	export let title: string | null = null;

	let clientWidth = 0;
	let clientHeight = 0;
</script>

<div class="vimeo-container" bind:clientHeight bind:clientWidth>
	<iframe
		src="https://player.vimeo.com/video/{vimeoId}?badge=0&amp;background=1&amp;player_id=0&amp;app_id=58479"
		frameborder="0"
		allow="autoplay;"
		{title}
		style="width: {Math.max(1, clientHeight / clientWidth) * 177.777778}%;"
	/>
</div>

<style>
	.vimeo-container {
		position: relative;
		width: 100%;
		height: 100%;
	}
	iframe {
		height: 56.25%;
		left: 50%;
		min-height: 100%;
		min-width: 100%;
		transform: translate(-50%, -50%);
		position: absolute;
		top: 50%;
		width: 177.77777778%;
	}
</style>
