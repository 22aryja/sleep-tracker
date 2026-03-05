<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let editingName = $state(false);
	let userName = $state('John');
	let nameInput = $state('');

	const stats = [
		{ label: 'Avg Sleep', value: '7h 24m', icon: '🌙' },
		{ label: 'Streak', value: '12 days', icon: '🔥' },
		{ label: 'Sleep Score', value: '84', icon: '⚡' },
		{ label: 'Locations', value: '5', icon: '📍' }
	];

	const sleepHistory = [
		{ day: 'Mon', hours: 6.5 },
		{ day: 'Tue', hours: 7.2 },
		{ day: 'Wed', hours: 5.8 },
		{ day: 'Thu', hours: 8.1 },
		{ day: 'Fri', hours: 7.6 },
		{ day: 'Sat', hours: 9.0 },
		{ day: 'Sun', hours: 7.4 }
	];

	const maxHours = Math.max(...sleepHistory.map((d) => d.hours));

	const achievements = [
		{ icon: '🏆', label: 'Early Riser', desc: '7 days in a row', unlocked: true },
		{ icon: '💤', label: 'Deep Sleeper', desc: '8h+ three nights', unlocked: true },
		{ icon: '🌍', label: 'Globe Trotter', desc: 'Slept in 3 cities', unlocked: true },
		{ icon: '🎯', label: 'Goal Crusher', desc: 'Hit target 30 days', unlocked: false },
		{ icon: '⭐', label: 'Perfect Week', desc: '8h every day', unlocked: false }
	];

	const settings = [
		{ icon: '🔔', label: 'Notifications', value: 'On' },
		{ icon: '🎯', label: 'Sleep Goal', value: '8h 00m' },
		{ icon: '🌍', label: 'Location Tracking', value: 'Active' },
		{ icon: '🌙', label: 'Bedtime Reminder', value: '10:30 PM' },
		{ icon: '📊', label: 'Weekly Report', value: 'Sunday' }
	];

	const circumference = 2 * Math.PI * 50;
	const score = 84;
	const dashOffset = circumference * (1 - score / 100);

	function startEdit() {
		nameInput = userName;
		editingName = true;
	}

	function saveName() {
		if (nameInput.trim()) userName = nameInput.trim();
		editingName = false;
	}

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<div class="min-h-dvh w-full overflow-y-auto bg-[#0e0f11] pb-10 text-[#f0ede8]">
		<!-- Header -->
		<div class="relative overflow-hidden px-6 pt-14">
			<div
				class="pointer-events-none absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.12)_0%,transparent_70%)]"
			></div>

			<div class="relative mb-5 flex items-end gap-5">
				<!-- Avatar -->
				<div class="relative h-20 w-20 shrink-0">
					<div
						class="absolute inset-0 animate-spin rounded-full [background:conic-gradient(#f5a623_0%_70%,rgba(255,255,255,0.08)_70%_100%)]"
						style="animation-duration:8s"
					></div>
					<div
						class="absolute inset-[3px] z-10 flex items-center justify-center rounded-full bg-[#2a1f0a] text-3xl"
					>
						😴
					</div>
					<div
						class="absolute right-0 bottom-0 z-20 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#0e0f11] bg-[#f5a623] text-[10px]"
					>
						✓
					</div>
				</div>

				<!-- Name -->
				<div class="flex-1">
					<p class="mb-1 text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
						Sleep Profile
					</p>
					{#if editingName}
						<div class="flex items-center gap-2">
							<input
								class="w-44 border-b-2 border-[#f5a623] bg-transparent text-xl font-bold text-[#f0ede8] outline-none"
								bind:value={nameInput}
								onkeydown={(e) => e.key === 'Enter' && saveName()}
								autofocus
							/>
							<button
								class="rounded-lg bg-[#f5a623] px-3 py-1 text-xs font-bold text-[#0e0f11]"
								onclick={saveName}>Save</button
							>
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<span class="text-2xl font-extrabold">{userName}</span>
							<button
								class="text-sm text-[#666] transition-colors hover:text-[#f5a623]"
								onclick={startEdit}>✎</button
							>
						</div>
					{/if}
					<div class="mt-1 flex items-center gap-1.5 text-xs text-[#666]">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f5a623]"></span>
						Almaty, Kazakhstan
					</div>
				</div>
			</div>
		</div>

		<!-- Score ring -->
		<div class="flex justify-center py-6">
			<div class="relative h-28 w-28">
				<svg class="-rotate-90" width="112" height="112" viewBox="0 0 120 120">
					<circle
						cx="60"
						cy="60"
						r="50"
						fill="none"
						stroke="rgba(255,255,255,0.06)"
						stroke-width="8"
					/>
					<circle
						cx="60"
						cy="60"
						r="50"
						fill="none"
						stroke="#f5a623"
						stroke-width="8"
						stroke-linecap="round"
						stroke-dasharray={circumference}
						stroke-dashoffset={dashOffset}
					/>
				</svg>
				<div class="absolute inset-0 flex flex-col items-center justify-center">
					<span class="text-3xl leading-none font-extrabold">{score}</span>
					<span class="mt-0.5 text-[10px] tracking-widest text-[#666] uppercase">Score</span>
				</div>
			</div>
		</div>

		<!-- Stats grid -->
		<div class="grid grid-cols-2 gap-2.5 px-5 pb-6">
			{#each stats as s, i}
				<div
					class="rounded-[18px] border border-white/[0.07] bg-[#16171b] p-4"
					style="animation: fadeUp 0.4s {i * 0.05 + 0.05}s both"
				>
					<span class="mb-2 block text-xl">{s.icon}</span>
					<div class="text-xl font-extrabold">{s.value}</div>
					<div class="text-[11px] tracking-wider text-[#666] uppercase">{s.label}</div>
				</div>
			{/each}
		</div>

		<!-- Weekly chart -->
		<div class="px-5 pb-6">
			<p class="mb-3.5 text-[13px] font-bold tracking-widest text-[#666] uppercase">This Week</p>
			<div class="rounded-[18px] border border-white/[0.07] bg-[#16171b] px-4 pt-4 pb-3">
				<div class="mb-2 flex h-20 items-end gap-2">
					{#each sleepHistory as d}
						{@const pct = (d.hours / maxHours) * 100}
						<div class="flex h-full flex-1 flex-col items-center justify-end gap-1">
							<div
								class="relative w-full overflow-hidden rounded-t-md"
								style="height:{pct}%; background: rgba(245,166,35,{d.hours >= 8
									? 0.55
									: d.hours >= 7
										? 0.4
										: 0.2})"
							>
								<div class="absolute top-0 right-0 left-0 h-[3px] rounded-t-md bg-[#f5a623]"></div>
							</div>
							<span class="text-[10px] tracking-wide text-[#666] uppercase">{d.day}</span>
						</div>
					{/each}
				</div>
				<div class="flex justify-between border-t border-white/[0.07] pt-2 text-[11px] text-[#666]">
					<span>5h → 9h range</span>
					<div class="flex items-center gap-1.5">
						<div class="h-0.5 w-4 rounded bg-[#f5a623]"></div>
						<span>8h goal</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Achievements -->
		<div class="px-5 pb-6">
			<p class="mb-3.5 text-[13px] font-bold tracking-widest text-[#666] uppercase">Achievements</p>
			<div class="flex flex-col gap-2.5">
				{#each achievements as a}
					<div
						class="flex items-center gap-3.5 rounded-2xl border bg-[#16171b] px-4 py-3.5"
						style="border-color: {a.unlocked ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.07)'}"
					>
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
							style="background: {a.unlocked
								? 'rgba(245,166,35,0.12)'
								: 'rgba(255,255,255,0.04)'}; {!a.unlocked
								? 'filter:grayscale(1) opacity(0.4)'
								: ''}"
						>
							{a.icon}
						</div>
						<div class="flex-1">
							<div class="text-sm font-bold" style="color: {a.unlocked ? '#f0ede8' : '#666'}">
								{a.label}
							</div>
							<div class="text-xs text-[#666]">{a.desc}</div>
						</div>
						{#if a.unlocked}
							<span class="text-base">🏅</span>
						{:else}
							<span class="text-sm text-white/15">🔒</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Settings -->
		<div class="px-5 pb-6">
			<p class="mb-3.5 text-[13px] font-bold tracking-widest text-[#666] uppercase">Settings</p>
			<div class="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#16171b]">
				{#each settings as s, i}
					<div
						class="flex cursor-pointer items-center gap-3.5 px-[18px] py-4 transition-colors hover:bg-white/[0.03]"
						style={i < settings.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.07)' : ''}
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(245,166,35,0.12)] text-base"
						>
							{s.icon}
						</div>
						<span class="flex-1 text-sm">{s.label}</span>
						<span class="mr-1.5 text-xs text-[#666]">{s.value}</span>
						<span class="text-xs text-white/20">›</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Sign out -->
		<div class="px-5">
			<button
				class="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-4 text-sm font-semibold text-red-400 transition-colors hover:border-red-400/25 hover:bg-red-400/[0.08]"
			>
				Sign Out
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
