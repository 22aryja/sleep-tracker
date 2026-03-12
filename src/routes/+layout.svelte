<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authState, initAuth } from '$lib/stores/auth.svelte';

	let { children } = $props();

	onMount(() => {
		initAuth();
	});

	$effect(() => {
		if (!authState.ready) return;
		const isAuthPage = page.url.pathname.startsWith('/auth');
		if (!authState.user && !isAuthPage) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto('/auth');
		} else if (authState.user && isAuthPage) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto('/');
		}
	});

	const isAuthPage = $derived(page.url.pathname.startsWith('/auth'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
{#if !isAuthPage}
	<div class="fixed bottom-0 left-0 z-9999 w-full">
		<Navbar />
	</div>
{/if}
