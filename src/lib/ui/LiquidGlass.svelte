<!-- LiquidGlass.svelte -->
<script lang="ts">
	let { children } = $props();
	const filterId = `liquid-glass-${crypto.randomUUID().slice(0, 8)}`;
</script>

<div class="liquid-glass" style="backdrop-filter: brightness(1.1) url(#{filterId});">
	{@render children()}
</div>

<svg style="display:none;">
	<filter id={filterId}>
		<feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" result="turbulence" />
		<feDisplacementMap
			in="SourceGraphic"
			in2="turbulence"
			scale="200"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
</svg>

<style>
	.liquid-glass {
		overflow: hidden;
		transition: opacity 0.26s ease-out;
		filter: drop-shadow(-8px -10px 46px #0000005f);
	}

	.liquid-glass::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		box-shadow:
			inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7),
			inset 0 0 8px 1px rgba(255, 255, 255, 0.7);
	}
</style>
