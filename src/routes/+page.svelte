<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { settings } from '$lib/stores/settings';
	import { trips } from '$lib/stores/trips';

	let mapContainer: HTMLDivElement;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let map: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let L: any;

	// Destination state
	let destination = $state<{ lat: number; lng: number } | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let destMarker: any = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let destCircle: any = null;

	// Current location
	let currentPos = $state<{ lat: number; lng: number } | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let currentMarker: any = null;
	let watchId: number | null = null;
	let centeredOnUser = false;

	// Status
	let distanceMeters = $state<number | null>(null);
	let geoError = $state('');
	let tracking = $state(false);

	// Alarm
	let alarmTriggered = $state(false);
	let audioCtx: AudioContext | null = null;
	let alarmLoopId: ReturnType<typeof setInterval> | null = null;
	let tripStartedAt: number | null = null;

	const alarmRadius = $derived($settings.alarmRadius);

	// ─── Helpers ────────────────────────────────────────────────

	function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
		const R = 6371000;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLng = ((lng2 - lng1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}

	function formatDist(m: number): string {
		return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
	}

	// ─── Alarm ──────────────────────────────────────────────────

	function scheduleBeeps(ctx: AudioContext) {
		const beep = (t: number) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.type = 'sine';
			osc.frequency.value = 880;
			gain.gain.setValueAtTime(0.6, t);
			gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
			osc.start(t);
			osc.stop(t + 0.25);
		};
		const now = ctx.currentTime;
		// Three quick beeps
		beep(now);
		beep(now + 0.35);
		beep(now + 0.7);
	}

	function startAlarm() {
		audioCtx = new AudioContext();
		scheduleBeeps(audioCtx);
		alarmLoopId = setInterval(() => {
			if (audioCtx) scheduleBeeps(audioCtx);
		}, 2500);
		navigator.vibrate?.([500, 150, 500, 150, 500, 150, 1000]);
		if (Notification.permission === 'granted') {
			new Notification('Wake up! 🔔', {
				body: "You're approaching your destination.",
				silent: false
			});
		}
	}

	function stopAlarm() {
		alarmTriggered = false;
		if (alarmLoopId) {
			clearInterval(alarmLoopId);
		}
		alarmLoopId = null;
		audioCtx?.close();
		audioCtx = null;
	}

	function triggerAlarm() {
		if (alarmTriggered) return;
		alarmTriggered = true;

		if (tripStartedAt && destination) {
			const now = Date.now();
			trips.addTrip({
				startedAt: tripStartedAt,
				arrivedAt: now,
				duration: now - tripStartedAt,
				destination: { lat: destination.lat, lng: destination.lng }
			});
			tripStartedAt = null;
		}

		startAlarm();
	}

	// ─── Location tracking ───────────────────────────────────────

	function startTracking() {
		if (watchId !== null) return;
		tracking = true;
		geoError = '';

		watchId = navigator.geolocation.watchPosition(
			(pos) => {
				const { latitude: lat, longitude: lng } = pos.coords;
				currentPos = { lat, lng };

				if (!currentMarker) {
					const icon = L.divIcon({
						className: '',
						html: `<div style="
              width:18px;height:18px;
              background:#f5a623;
              border-radius:50%;
              border:3px solid #fff;
              box-shadow:0 0 0 5px rgba(245,166,35,0.25);
            "></div>`,
						iconSize: [18, 18],
						iconAnchor: [9, 9]
					});
					currentMarker = L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(map);
					if (!centeredOnUser) {
						map.setView([lat, lng], 15);
						centeredOnUser = true;
					}
				} else {
					currentMarker.setLatLng([lat, lng]);
				}

				if (destination) {
					const dist = haversine(lat, lng, destination.lat, destination.lng);
					distanceMeters = dist;
					if (dist <= alarmRadius) triggerAlarm();
				}
			},
			(err) => {
				geoError =
					err.code === 1
						? 'Location permission denied. Please allow access in your browser settings.'
						: 'Could not get your location. Make sure GPS is enabled.';
				tracking = false;
			},
			{ enableHighAccuracy: true, maximumAge: 4000, timeout: 10000 }
		);
	}

	function stopTracking() {
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			watchId = null;
		}
		tracking = false;
		currentMarker?.remove();
		currentMarker = null;
		currentPos = null;
		distanceMeters = null;
	}

	// ─── Destination ─────────────────────────────────────────────

	function setDestination(lat: number, lng: number) {
		destination = { lat, lng };
		tripStartedAt = Date.now();

		destCircle?.remove();
		destMarker?.remove();

		const icon = L.divIcon({
			className: '',
			html: `<div style="
          width:28px;height:28px;
          background:#f5a623;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid #fff;
          box-shadow:0 3px 10px rgba(0,0,0,0.5);
        "></div>`,
			iconSize: [28, 28],
			iconAnchor: [14, 28]
		});

		destMarker = L.marker([lat, lng], { icon }).addTo(map);
		destCircle = L.circle([lat, lng], {
			radius: alarmRadius,
			color: '#f5a623',
			fillColor: '#f5a623',
			fillOpacity: 0.08,
			weight: 1.5,
			dashArray: '6 4'
		}).addTo(map);

		if (!tracking) startTracking();

		// Check distance immediately with current position
		if (currentPos) {
			const dist = haversine(currentPos.lat, currentPos.lng, lat, lng);
			distanceMeters = dist;
			if (dist <= alarmRadius) triggerAlarm();
		}
	}

	function clearDestination() {
		stopAlarm();
		destMarker?.remove();
		destMarker = null;
		destCircle?.remove();
		destCircle = null;
		destination = null;
		distanceMeters = null;
		tripStartedAt = null;
	}

	// ─── Lifecycle ───────────────────────────────────────────────

	onMount(async () => {
		L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(mapContainer, { center: [43.222, 76.8512], zoom: 13 });
		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			maxZoom: 19
		}).addTo(map);

		map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
			if (!alarmTriggered) setDestination(e.latlng.lat, e.latlng.lng);
		});

		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission();
		}

		startTracking();
	});

	onDestroy(() => {
		map?.remove();
		stopTracking();
		stopAlarm();
	});
</script>

<!-- Map -->
<div bind:this={mapContainer} style="width:100%;height:100dvh;"></div>

<!-- Center on me button -->
{#if currentPos}
	<button
		onclick={() => map.setView([currentPos!.lat, currentPos!.lng], 15)}
		class="absolute right-4 z-500 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0e0f11]/90 text-lg backdrop-blur transition-colors active:bg-white/10 text-white/50"
		style="bottom: {destination && !alarmTriggered ? '17rem' : '6.5rem'}"
		title="Center on my location"
	>
		◎
	</button>
{/if}

<!-- Instruction toast (no destination set) -->
{#if !destination && !geoError}
	<div
		class="pointer-events-none absolute top-6 left-1/2 z-500 -translate-x-1/2 rounded-full border border-white/10 bg-[#0e0f11]/80 px-5 py-2.5 backdrop-blur"
		style="animation: fadeUp 0.4s both"
	>
		<p class="text-center text-[13px] font-semibold text-[#f0ede8]">
			🌙 Tap the map to set your destination
		</p>
	</div>
{/if}

<!-- Geo error -->
{#if geoError}
	<div
		class="absolute top-6 right-4 left-4 z-[500] rounded-2xl border border-red-500/20 bg-[#0e0f11]/90 px-5 py-4 backdrop-blur"
	>
		<p class="text-sm text-red-400">{geoError}</p>
	</div>
{/if}

<!-- Bottom panel (destination set) -->
{#if destination && !alarmTriggered}
	<div
		class="absolute right-4 bottom-24 left-4 z-500 overflow-hidden rounded-2xl border border-white/10 bg-transparent backdrop-blur"
		style="animation: slideUp 0.3s both"
	>
		<div class="flex items-center justify-between px-5 pt-4 pb-1">
			<div>
				<p class="text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
					{tracking ? 'Tracking · GPS active' : 'Starting GPS…'}
				</p>
				<h2 class="mt-0.5 text-lg font-extrabold text-gray-200">Destination Set</h2>
			</div>
			<!-- Status dot -->
			<div class="flex flex-col items-center gap-1">
				<div
					class="h-3 w-3 rounded-full {tracking ? 'bg-green-400' : 'bg-[#555]'}"
					style={tracking ? 'animation: pulse 1.5s infinite' : ''}
				></div>
				<span class="text-[10px] text-[#555]">{tracking ? 'Live' : 'Waiting'}</span>
			</div>
		</div>

		<!-- Distance bar -->
		{#if distanceMeters !== null}
			<div class="mx-5 mt-3">
				<div class="flex justify-between text-[11px] text-[#666]">
					<span>Distance to destination</span>
					<span class="font-bold text-[#f5a623]">{formatDist(distanceMeters)}</span>
				</div>
				<div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
					<div
						class="h-full rounded-full bg-[#f5a623] transition-all duration-500"
						style="width: {Math.max(4, Math.min(100, 100 - (distanceMeters / 2000) * 100))}%"
					></div>
				</div>
			</div>
		{:else}
			<div class="mx-5 mt-3">
				<p class="text-[12px] text-[#555]">Waiting for GPS fix…</p>
			</div>
		{/if}

		<!-- Alarm zone info -->
		<div class="mx-5 mt-3 mb-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-full border-2 border-dashed border-[#f5a623] opacity-70"></div>
				<span class="text-[11px] text-[#666]">Alarm triggers within {alarmRadius} m</span>
			</div>
			<button
				onclick={clearDestination}
				class="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-red-400 transition-colors hover:border-red-400/30 hover:bg-red-400/10"
			>
				Cancel
			</button>
		</div>
	</div>
{/if}

<!-- Alarm overlay -->
{#if alarmTriggered}
	<div
		class="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0e0f11]/95 px-8 text-center backdrop-blur"
		style="animation: fadeIn 0.3s both"
	>
		<div
			class="mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#f5a623] bg-[rgba(245,166,35,0.12)] text-6xl"
			style="animation: ringPulse 1s ease-in-out infinite"
		>
			🔔
		</div>

		<p class="mb-2 text-[11px] font-semibold tracking-widest text-[#f5a623] uppercase">Wake up!</p>
		<h1 class="mb-3 text-4xl font-extrabold text-gray-200">You've arrived!</h1>
		<p class="mb-10 max-w-xs text-sm leading-relaxed text-[#888]">
			You're within {alarmRadius} m of your destination. Time to get off!
		</p>

		<button
			onclick={() => {
				stopAlarm();
				clearDestination();
			}}
			class="w-full max-w-xs rounded-2xl bg-[#f5a623] py-4 text-base font-bold text-[#0e0f11] transition-opacity active:opacity-80"
		>
			Dismiss Alarm
		</button>
	</div>
{/if}

<style>
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translate(-50%, 8px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes ringPulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4);
		}
		50% {
			box-shadow: 0 0 0 20px rgba(245, 166, 35, 0);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
</style>
