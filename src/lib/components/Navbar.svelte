<script lang="ts">
	import LiquidGlass from '$lib/ui/LiquidGlass.svelte';
	import UpgradeModal from '$lib/components/UpgradeModal.svelte';
	import { Star, User, Map, type IconProps } from '@lucide/svelte';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { authState } from '$lib/stores/auth.svelte';
	import type { Component } from 'svelte';

	interface NavItem {
		name: string;
		redirectTo: string;
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		icon: Component<IconProps, {}, ''>;
		proOnly?: boolean;
	}

	const items: NavItem[] = [
		{ name: 'Map', redirectTo: '/', icon: Map },
		{ name: 'Featured', redirectTo: '/featured', icon: Star, proOnly: true },
		{ name: 'Profile', redirectTo: '/profile', icon: User }
	];

	let showUpgrade = $state(false);
	let upgradeFeature = $state('');

	const isFree: boolean = $derived(authState.user?.plan === 'free');

	const handleNavigate = (item: NavItem) => {
		if (item.proOnly && isFree) {
			upgradeFeature = item.name;
			showUpgrade = true;
			return;
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(item.redirectTo);
	};
</script>

<UpgradeModal bind:show={showUpgrade} feature={upgradeFeature} />

<section class="flex w-full items-center justify-center p-0.5">
	<LiquidGlass class="w-1/2 rounded-xl">
		<nav class="relative flex w-full justify-center gap-4 overflow-hidden rounded-xl p-2">
			{#each items as item(item.name)}
				{@const isActive: boolean = page.url.pathname === item.redirectTo}
				<button
					class="flex w-12 shrink-0 flex-col items-center"
					onclick={() => handleNavigate(item)}
				>
					<item.icon
						strokeWidth={1}
						class={cn('text-white', isActive && 'drop-shadow-[0_0_4px_var(--color-white)]')}
					/>
					<h1 class="text-[10px] text-white">
						{item.name}
					</h1>
				</button>
			{/each}
		</nav>
	</LiquidGlass>
</section>
