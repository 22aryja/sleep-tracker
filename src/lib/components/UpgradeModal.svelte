<script lang="ts">
	let { show = $bindable(false), feature = '' }: { show: boolean; feature: string } = $props();
</script>

{#if show}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md"
		onclick={() => (show = false)}
		style="animation: modalFadeIn 0.25s both"
	>
		<div
			class="mx-6 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#16171b] shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			style="animation: modalSlideUp 0.3s both"
		>
			<!-- Icon -->
			<div class="flex flex-col items-center pt-8 pb-2">
				<div
					class="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f5a623]/30 bg-[rgba(245,166,35,0.1)] text-4xl"
				>
					🔒
				</div>
				<h2 class="mb-1.5 text-xl font-extrabold text-[#f0ede8]">Pro Feature</h2>
				<p class="max-w-[260px] text-center text-sm leading-relaxed text-[#888]">
					<span class="font-semibold text-[#f5a623]">{feature}</span> is available only with a Pro subscription.
				</p>
			</div>

			<!-- Feature highlights -->
			<div class="mx-6 mt-4 mb-5 flex flex-col gap-2.5">
				{#each ['Full sleep analytics & trends', 'Sleep score & AI insights', 'Achievements & streaks', 'Curated tips & nearby spots'] as perk}
					<div class="flex items-center gap-2.5">
						<span class="text-xs text-[#f5a623]">✓</span>
						<span class="text-[13px] text-[#aaa]">{perk}</span>
					</div>
				{/each}
			</div>

			<!-- Buttons -->
			<div class="flex flex-col gap-2.5 px-6 pb-7">
				<button
					class="w-full rounded-2xl bg-[#f5a623] py-3.5 text-sm font-bold text-[#0e0f11] transition-opacity active:opacity-80"
				>
					Upgrade to Pro — $9.99/mo
				</button>
				<button
					class="w-full rounded-2xl border border-white/[0.08] py-3 text-sm font-semibold text-[#666] transition-colors active:bg-white/5"
					onclick={() => (show = false)}
				>
					Maybe Later
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes modalFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes modalSlideUp {
		from { opacity: 0; transform: translateY(24px) scale(0.96); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
</style>
