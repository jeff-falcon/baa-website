<div class="logo">
	<img width="72" height="30" src="/baa-logo-light.png" alt="BAA logo" />
</div>

<style>
	img {
		display: block;
		height: 100%;
		width: auto;
		visibility: hidden;
	}
	.logo {
		-webkit-mask-image: url('/baa-logo-light.png');
		mask-image: url('/baa-logo-light.png');
		-webkit-mask-size: contain;
		mask-size: contain;
		width: 58px;
		height: 24px;
		background: currentColor;
	}
	@media (min-width: 720px) {
		.logo {
			width: 72px;
			height: 30px;
		}
	}
</style>
