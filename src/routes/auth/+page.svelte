<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="flex min-h-dvh w-full flex-col items-center justify-between bg-[#0e0f11] px-6 py-16 text-[#f0ede8]">
	<!-- Top spacer -->
	<div></div>

	<!-- Hero -->
	<div class="flex flex-col items-center gap-7 text-center">
		<div class="relative flex items-center justify-center">
			<div
				class="absolute h-44 w-44 rounded-full"
				style="background: radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%)"
			></div>
			<div
				class="relative flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.1)] text-6xl"
			>
				🌙
			</div>
		</div>

		<div>
			<h1 class="mb-2 text-4xl font-extrabold tracking-tight">Sleep Tracker</h1>
			<p class="max-w-xs text-sm leading-relaxed text-[#888]">
				Track your sleep, discover rest-friendly spots, and build healthier habits — one night at a
				time.
			</p>
		</div>

		<!-- Feature pills -->
		<div class="flex flex-wrap justify-center gap-2">
			{#each ['🗺️ Sleep Map', '📊 Analytics', '🏆 Achievements', '💡 Tips'] as f}
				<span
					class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-[#888]"
					>{f}</span
				>
			{/each}
		</div>
	</div>

	<!-- CTA -->
	<div class="w-full flex flex-col gap-3">
		<button
			onclick={() => goto('/auth/register')}
			class="w-full rounded-2xl bg-[#f5a623] py-4 text-sm font-bold tracking-wide text-[#0e0f11] transition-opacity active:opacity-80"
		>
			Create Account
		</button>
		<button
			onclick={() => goto('/auth/login')}
			class="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-sm font-semibold text-[#f0ede8] transition-colors active:bg-white/[0.08]"
		>
			Sign In
		</button>
	</div>
</div>
