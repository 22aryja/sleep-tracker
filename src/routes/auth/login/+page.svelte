<script lang="ts">
	import { goto } from '$app/navigation';
	import { authState } from '$lib/stores/auth.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');

	function submit() {
		error = '';
		if (!email.trim() || !password) {
			error = 'Please fill in all fields.';
			return;
		}
		const stored = localStorage.getItem('sleeptracker_user');
		if (!stored) {
			error = 'No account found. Please create an account first.';
			return;
		}
		const user = JSON.parse(stored);
		if (user.email !== email.trim() || user.password !== password) {
			error = 'Incorrect email or password.';
			return;
		}
		authState.user = user;
		goto('/');
	}
</script>

<div class="flex min-h-dvh w-full flex-col bg-[#0e0f11] px-6 pt-14 pb-10 text-[#f0ede8]">
	<!-- Back -->
	<button
		onclick={() => goto('/auth')}
		class="mb-8 flex w-fit items-center gap-1.5 text-sm text-[#666] transition-colors hover:text-[#f0ede8]"
	>
		<span class="text-base">←</span> Back
	</button>

	<!-- Header -->
	<div class="mb-10">
		<p class="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#f5a623]">
			Welcome back
		</p>
		<h1 class="text-3xl font-extrabold">Sign In</h1>
		<p class="mt-2 text-sm text-[#666]">Good to see you again 🌙</p>
	</div>

	<!-- Form -->
	<div class="flex flex-col gap-4">
		<div>
			<label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
				>Email</label
			>
			<input
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
			/>
		</div>

		<div>
			<label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
				>Password</label
			>
			<input
				type="password"
				bind:value={password}
				placeholder="••••••••"
				onkeydown={(e) => e.key === 'Enter' && submit()}
				class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
			/>
		</div>

		{#if error}
			<p class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
				{error}
			</p>
		{/if}

		<button
			onclick={submit}
			class="mt-2 w-full rounded-2xl bg-[#f5a623] py-4 text-sm font-bold tracking-wide text-[#0e0f11] transition-opacity active:opacity-80"
		>
			Sign In
		</button>
	</div>

	<!-- Footer -->
	<p class="mt-8 text-center text-sm text-[#555]">
		Don't have an account?
		<button
			onclick={() => goto('/auth/register')}
			class="ml-1 font-semibold text-[#f5a623]"
		>
			Create one
		</button>
	</p>
</div>
