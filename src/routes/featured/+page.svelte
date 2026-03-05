<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  let activeFilter = $state<'all' | 'articles' | 'spots'>('all');

  const articles = [
    {
      type: 'article' as const,
      tag: 'Tip',
      icon: '💡',
      title: 'The 10-3-2-1-0 Rule for Better Sleep',
      desc: '10h before bed: no caffeine. 3h: no food. 2h: no work. 1h: no screens. 0: times you hit snooze.',
      read: '3 min',
      time: '2h ago',
    },
    {
      type: 'article' as const,
      tag: 'Science',
      icon: '🧠',
      title: 'Why REM Sleep Repairs Your Brain',
      desc: 'During REM, your brain processes emotions and consolidates memories. Cutting it short affects mood for days.',
      read: '5 min',
      time: '5h ago',
    },
    {
      type: 'article' as const,
      tag: 'Habit',
      icon: '🌡️',
      title: 'The Ideal Room Temperature for Sleep',
      desc: 'Research points to 65–68°F (18–20°C) as the sweet spot. Your core temp needs to drop to initiate sleep.',
      read: '2 min',
      time: '1d ago',
    },
    {
      type: 'article' as const,
      tag: 'Science',
      icon: '☕',
      title: 'Caffeine Has a 5-Hour Half-Life',
      desc: 'That 3 PM coffee is still 25% active at 1 AM. Shifting your last cup to noon can add 30 min of deep sleep.',
      read: '3 min',
      time: '2d ago',
    },
    {
      type: 'article' as const,
      tag: 'Tip',
      icon: '📵',
      title: 'Blue Light is Not the Main Culprit',
      desc: "New research suggests it's mental stimulation from screens, not the light, that keeps you awake.",
      read: '4 min',
      time: '3d ago',
    },
  ];

  const spots = [
    {
      type: 'spot' as const,
      icon: '🌿',
      name: 'Kok-Tobe Hill Park',
      category: 'Nature',
      desc: 'Fresh mountain air and low noise. Great for a pre-sleep evening walk.',
      dist: '1.2 km',
      rating: 4.8,
    },
    {
      type: 'spot' as const,
      icon: '🛁',
      name: 'Arasan Baths',
      category: 'Spa',
      desc: 'Warm baths lower core body temp post-soak — a proven sleep trigger.',
      dist: '2.4 km',
      rating: 4.6,
    },
    {
      type: 'spot' as const,
      icon: '🍵',
      name: 'Chai Khana Lounge',
      category: 'Café',
      desc: 'Caffeine-free herbal teas in a quiet setting. Ideal for winding down.',
      dist: '0.8 km',
      rating: 4.5,
    },
    {
      type: 'spot' as const,
      icon: '🧘',
      name: 'Namaste Studio',
      category: 'Yoga',
      desc: 'Evening yin yoga classes. Parasympathetic activation helps sleep onset.',
      dist: '1.7 km',
      rating: 4.9,
    },
    {
      type: 'spot' as const,
      icon: '🌲',
      name: 'Central Gorky Park',
      category: 'Nature',
      desc: 'Tree-lined paths with low light pollution. Perfect for a sunset walk.',
      dist: '3.1 km',
      rating: 4.4,
    },
  ];

  type ArticleItem = typeof articles[number];
  type SpotItem = typeof spots[number];
  type Item = ArticleItem | SpotItem;

  const filters: Array<['all' | 'articles' | 'spots', string]> = [
    ['all', 'All'],
    ['articles', 'Articles'],
    ['spots', 'Nearby Spots'],
  ];

  const interleavedFeed = $derived<Item[]>(
    activeFilter === 'all'
      ? articles.flatMap((a, i) => (spots[i] ? [a, spots[i]] : [a]))
      : activeFilter === 'articles'
      ? articles
      : spots
  );

  onMount(() => { mounted = true; });
</script>

{#if mounted}
<div class="min-h-dvh w-full overflow-y-auto bg-[#0e0f11] pb-10 text-[#f0ede8]">

  <!-- Top bar -->
  <div class="sticky top-0 z-10 bg-[#0e0f11]/90 px-6 pb-4 pt-14 backdrop-blur">
    <div class="mb-4">
      <p class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#f5a623]">Almaty, KZ</p>
      <h1 class="text-2xl font-extrabold">Featured</h1>
    </div>

    <!-- Filter pills -->
    <div class="flex gap-2">
      {#each filters as [val, label]}
        <button
          class="rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors {activeFilter === val
            ? 'border-[#f5a623] bg-[#f5a623] text-[#0e0f11]'
            : 'border-white/10 text-[#666]'}"
          onclick={() => activeFilter = val}
        >{label}</button>
      {/each}
    </div>
  </div>

  <!-- Feed -->
  <div class="flex flex-col px-5">
    {#each interleavedFeed as item, i}
      <div
        class="cursor-pointer border-b border-white/[0.07] py-5"
        style="animation: fadeUp 0.35s {i * 0.04}s both"
      >
        {#if item.type === 'article'}
          <!-- Article row -->
          <div class="mb-2 flex items-center gap-2">
            <span class="rounded-full border border-[#f5a623]/30 bg-[rgba(245,166,35,0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#f5a623]">
              {item.tag}
            </span>
            <span class="text-[10px] text-[#555]">{item.time}</span>
          </div>
          <div class="flex items-start gap-4">
            <div class="flex-1">
              <h3 class="mb-1.5 text-[15px] font-bold leading-snug">{item.title}</h3>
              <p class="mb-3 line-clamp-2 text-sm leading-relaxed text-[#888]">{item.desc}</p>
              <span class="text-[11px] text-[#555]">{item.read} read</span>
            </div>
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(245,166,35,0.12)] bg-[rgba(245,166,35,0.08)] text-2xl">
              {item.icon}
            </div>
          </div>

        {:else}
          <!-- Spot row -->
          <div class="mb-2 flex items-center gap-2">
            <span class="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#aaa]">
              {item.category}
            </span>
            <span class="text-[10px] text-[#555]">📍 {item.dist} away</span>
          </div>
          <div class="flex items-start gap-4">
            <div class="flex-1">
              <h3 class="mb-1.5 text-[15px] font-bold leading-snug">{item.name}</h3>
              <p class="mb-3 line-clamp-2 text-sm leading-relaxed text-[#888]">{item.desc}</p>
              <div class="flex items-center gap-1 text-[11px]">
                <span class="text-[#f5a623]">★</span>
                <span class="text-[#555]">{item.rating}</span>
              </div>
            </div>
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-2xl">
              {item.icon}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

</div>
{/if}

<style>
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>