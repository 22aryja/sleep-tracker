<script lang="ts">
	import LiquidGlass from '$lib/ui/LiquidGlass.svelte';
	import { Star, User, Map } from '@lucide/svelte';
	import { page } from '$app/state';

	const items = [
		{ name: 'Map', redirectTo: '/', icon: Map },
		{ name: 'Featured', redirectTo: '/featured', icon: Star },
		{ name: 'Profile', redirectTo: '/profile', icon: User }
	];

</script>

<section class="flex w-full justify-center p-0.5">
	<LiquidGlass class="w-1/2 rounded-xl">
		<nav class="flex w-full justify-center gap-4 overflow-hidden rounded-xl p-2">
			{#each items as item (item.name)}
				{@const isActive: boolean = page.url.pathname === item.redirectTo}

				<a href={item.redirectTo} class="flex w-12 shrink-0 flex-col items-center">
					<item.icon strokeWidth={1} class="text-white"  />
					<h1 class="text-[10px] text-white">{item.name}</h1>
				</a>
			{/each}
		</nav>
	</LiquidGlass>
</section>
