<script lang="ts">
	import LiquidGlass from '$lib/ui/LiquidGlass.svelte';
	import { Star, User, Map, type IconProps } from '@lucide/svelte';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import type { Component } from 'svelte';

	interface NavItem {
		name: string;
		redirectTo: string;
		icon: Component<IconProps, {}, ''>;
	}

	const items: NavItem[] = [
		{ name: 'Map', redirectTo: '/', icon: Map },
		{ name: 'Featured', redirectTo: '/featured', icon: Star },
		{ name: 'Profile', redirectTo: '/profile', icon: User }
	];

	let currentIndex = $state<number>(0);
	let position = $derived((): number => {
		switch (currentIndex) {
			case 0:
				return 0.25;
			case 1:
				return 4.25;
			case 2:
				return 8.25;
			default:
				return 0;
		}
	});

	const handleNavigate = (item: NavItem, index: number) => {
		currentIndex = index;
		goto(item.redirectTo);
	};
</script>

<section class="flex w-full items-center justify-center p-0.5">
	<LiquidGlass class="w-1/2 rounded-xl">
		<nav class="relative flex w-full justify-center gap-4 overflow-hidden rounded-xl p-2">
			{#each items as item, index (item.name)}
				{@const isActive: boolean = page.url.pathname === item.redirectTo}
				<button
					class="flex w-12 shrink-0 flex-col items-center"
					onclick={() => handleNavigate(item, index)}
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
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div
				class="pointer-events-none absolute top-0 left-0 flex h-14 w-14 shrink-0 rounded-full bg-white opacity-10 transition-transform"
				style:transform={`translateX(${position()}rem)`}
			/>
		</nav>
	</LiquidGlass>
</section>
