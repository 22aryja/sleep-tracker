<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let mapContainer: HTMLDivElement;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let map: any;

	onMount(async () => {
		// @ts-nocheck
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(mapContainer, {
			center: [43.222, 76.8512], // Almaty
			zoom: 12
		});

		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			maxZoom: 19
		}).addTo(map);
	});

	onDestroy(() => map?.remove());
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100dvh;"></div>
