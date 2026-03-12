<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveUser, type Plan } from '$lib/stores/auth.svelte';

	let step = $state(1);

	// Step 1 – credentials
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	// Step 2 – profile
	let firstName = $state('');
	let lastName = $state('');
	let age = $state('');
	let city = $state('');

	// Step 3 – plan
	let plan = $state<Plan>('free');

	let error = $state('');

	function nextStep1() {
		error = '';
		if (!email.trim() || !password || !confirmPassword) {
			error = 'Please fill in all fields.';
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			error = 'Please enter a valid email address.';
			return;
		}
		if (password.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		step = 2;
	}

	function nextStep2() {
		error = '';
		if (!firstName.trim() || !lastName.trim() || !age || !city.trim()) {
			error = 'Please fill in all fields.';
			return;
		}
		const ageNum = parseInt(age);
		if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
			error = 'Please enter a valid age.';
			return;
		}
		step = 3;
	}

	function finish() {
		saveUser({
			email: email.trim(),
			password,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			age: parseInt(age),
			city: city.trim(),
			plan
		});
		goto('/');
	}

	const steps = ['Account', 'Profile', 'Plan'];
</script>

<div class="flex min-h-dvh w-full flex-col bg-[#0e0f11] px-6 pt-14 pb-10 text-[#f0ede8]">
	<!-- Back -->
	<button
		onclick={() => (step > 1 ? (step -= 1) : goto('/auth'))}
		class="mb-8 flex w-fit items-center gap-1.5 text-sm text-[#666] transition-colors hover:text-[#f0ede8]"
	>
		<span class="text-base">←</span> Back
	</button>

	<!-- Step indicator -->
	<div class="mb-8 flex items-center gap-2">
		{#each steps as label, i}
			{@const idx = i + 1}
			<div class="flex items-center gap-2">
				<div
					class="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all"
					style="background: {idx < step
						? '#f5a623'
						: idx === step
							? 'rgba(245,166,35,0.2)'
							: 'rgba(255,255,255,0.06)'}; color: {idx <= step ? '#f5a623' : '#555'}; border: 1.5px solid {idx <= step ? '#f5a623' : 'rgba(255,255,255,0.1)'}"
				>
					{#if idx < step}
						✓
					{:else}
						{idx}
					{/if}
				</div>
				<span class="text-[11px] {idx === step ? 'text-[#f0ede8]' : 'text-[#555]'}">{label}</span>
			</div>
			{#if i < steps.length - 1}
				<div class="h-px flex-1" style="background: {step > idx ? '#f5a623' : 'rgba(255,255,255,0.08)'}"></div>
			{/if}
		{/each}
	</div>

	<!-- Header -->
	<div class="mb-8">
		<p class="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#f5a623]">
			Step {step} of 3
		</p>
		<h1 class="text-3xl font-extrabold">
			{#if step === 1}Create Account{/if}
			{#if step === 2}Your Profile{/if}
			{#if step === 3}Choose a Plan{/if}
		</h1>
		<p class="mt-2 text-sm text-[#666]">
			{#if step === 1}Start your sleep journey today 🌙{/if}
			{#if step === 2}Tell us a little about yourself 👤{/if}
			{#if step === 3}Pick what works for you ✨{/if}
		</p>
	</div>

	<!-- Step 1: Credentials -->
	{#if step === 1}
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
					placeholder="Min. 6 characters"
					class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
				/>
			</div>
			<div>
				<label class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
					>Confirm Password</label
				>
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="••••••••"
					onkeydown={(e) => e.key === 'Enter' && nextStep1()}
					class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
				/>
			</div>

			{#if error}
				<p class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</p>
			{/if}

			<button
				onclick={nextStep1}
				class="mt-2 w-full rounded-2xl bg-[#f5a623] py-4 text-sm font-bold tracking-wide text-[#0e0f11] transition-opacity active:opacity-80"
			>
				Continue →
			</button>
		</div>
	{/if}

	<!-- Step 2: Profile info -->
	{#if step === 2}
		<div class="flex flex-col gap-4">
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
						>First Name</label
					>
					<input
						type="text"
						bind:value={firstName}
						placeholder="John"
						class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
					/>
				</div>
				<div>
					<label
						class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
						>Last Name</label
					>
					<input
						type="text"
						bind:value={lastName}
						placeholder="Doe"
						class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label
						class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
						>Age</label
					>
					<input
						type="number"
						bind:value={age}
						placeholder="25"
						min="10"
						max="120"
						class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
					/>
				</div>
				<div>
					<label
						class="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#666]"
						>City</label
					>
					<input
						type="text"
						bind:value={city}
						placeholder="Almaty"
						class="w-full rounded-xl border border-white/10 bg-[#16171b] px-4 py-3.5 text-sm text-[#f0ede8] placeholder-[#444] outline-none transition-colors focus:border-[#f5a623]"
					/>
				</div>
			</div>

			{#if error}
				<p class="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</p>
			{/if}

			<button
				onclick={nextStep2}
				class="mt-2 w-full rounded-2xl bg-[#f5a623] py-4 text-sm font-bold tracking-wide text-[#0e0f11] transition-opacity active:opacity-80"
			>
				Continue →
			</button>
		</div>
	{/if}

	<!-- Step 3: Plan -->
	{#if step === 3}
		<div class="flex flex-col gap-4">
			<!-- Free plan -->
			<button
				onclick={() => (plan = 'free')}
				class="relative w-full rounded-2xl border p-5 text-left transition-all"
				style="border-color: {plan === 'free'
					? '#f5a623'
					: 'rgba(255,255,255,0.08)'}; background: {plan === 'free'
					? 'rgba(245,166,35,0.07)'
					: '#16171b'}"
			>
				{#if plan === 'free'}
					<div
						class="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5a623] text-[10px] font-bold text-[#0e0f11]"
					>
						✓
					</div>
				{/if}
				<div class="mb-3 flex items-center gap-3">
					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-xl"
					>
						🌙
					</div>
					<div>
						<p class="font-extrabold">Free</p>
						<p class="text-xl font-extrabold text-[#f5a623]">$0</p>
					</div>
				</div>
				<ul class="flex flex-col gap-1.5 text-sm text-[#888]">
					{#each ['Basic sleep logging', 'Weekly sleep chart', 'Sleep tips feed', '3 nearby spots'] as f}
						<li class="flex items-center gap-2"><span class="text-[#f5a623]">✓</span>{f}</li>
					{/each}
				</ul>
			</button>

			<!-- Paid plan -->
			<button
				onclick={() => (plan = 'paid')}
				class="relative w-full rounded-2xl border p-5 text-left transition-all"
				style="border-color: {plan === 'paid'
					? '#f5a623'
					: 'rgba(255,255,255,0.08)'}; background: {plan === 'paid'
					? 'rgba(245,166,35,0.07)'
					: '#16171b'}"
			>
				<!-- Badge -->
				<div
					class="absolute -top-3 left-4 rounded-full bg-[#f5a623] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0e0f11]"
				>
					Most Popular
				</div>

				{#if plan === 'paid'}
					<div
						class="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5a623] text-[10px] font-bold text-[#0e0f11]"
					>
						✓
					</div>
				{/if}

				<div class="mb-3 flex items-center gap-3">
					<div
						class="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(245,166,35,0.15)] text-xl"
					>
						⚡
					</div>
					<div>
						<p class="font-extrabold">Pro</p>
						<div class="flex items-baseline gap-1">
							<p class="text-xl font-extrabold text-[#f5a623]">$9.99</p>
							<span class="text-[11px] text-[#555]">/ month</span>
						</div>
					</div>
				</div>
				<ul class="flex flex-col gap-1.5 text-sm text-[#888]">
					{#each [
						'Everything in Free',
						'Full sleep analytics & trends',
						'Unlimited nearby spots',
						'Sleep score & AI insights',
						'Achievements & streaks',
						'Priority support'
					] as f}
						<li class="flex items-center gap-2"><span class="text-[#f5a623]">✓</span>{f}</li>
					{/each}
				</ul>
			</button>

			<button
				onclick={finish}
				class="mt-2 w-full rounded-2xl bg-[#f5a623] py-4 text-sm font-bold tracking-wide text-[#0e0f11] transition-opacity active:opacity-80"
			>
				Get Started 🌙
			</button>

			<p class="text-center text-[11px] text-[#444]">You can change your plan anytime from settings.</p>
		</div>
	{/if}

	<!-- Footer link -->
	{#if step === 1}
		<p class="mt-8 text-center text-sm text-[#555]">
			Already have an account?
			<button onclick={() => goto('/auth/login')} class="ml-1 font-semibold text-[#f5a623]">
				Sign in
			</button>
		</p>
	{/if}
</div>
