<script lang="ts">
	import { settings } from '$lib/stores/settings';

	const items: Array<{ icon: string; label: string; key: 'notifications' | 'allowTracking' }> = [
		{ icon: '🔔', label: 'Notifications', key: 'notifications' },
		{ icon: '🌍', label: 'Location Tracking', key: 'allowTracking' }
	];

	const radiusOptions = [100, 200, 300, 500, 1000];
</script>

<div class="px-5 pb-6">
	<p class="mb-3.5 text-[13px] font-bold tracking-widest text-[#666] uppercase">Settings</p>
	<div class="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#16171b]">
		{#each items as s, i (i)}
			{@const value = $settings[s.key]}
			<div
				class="flex items-center gap-3.5 px-4.5 py-4"
				style="border-bottom: 1px solid rgba(255,255,255,0.07)"
			>
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(245,166,35,0.12)] text-base"
				>
					{s.icon}
				</div>
				<span class="flex-1 text-sm text-[#f0ede8]">{s.label}</span>
				<span class="text-xs {value ? 'text-[#f5a623]' : 'text-[#666]'}">{value ? 'On' : 'Off'}</span>
			</div>
		{/each}

		<!-- Alarm radius -->
		<div class="flex items-center gap-3.5 px-4.5 py-4">
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(245,166,35,0.12)] text-base"
			>
				📏
			</div>
			<span class="flex-1 text-sm text-[#f0ede8]">Alarm Radius</span>
			<div class="flex items-center gap-1.5">
				{#each radiusOptions as r (r)}
					<button
						class="rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors {$settings.alarmRadius === r
							? 'bg-[#f5a623] text-[#0e0f11]'
							: 'bg-white/[0.06] text-[#666]'}"
						onclick={() => ($settings.alarmRadius = r)}
					>
						{r >= 1000 ? `${r / 1000}km` : `${r}m`}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
