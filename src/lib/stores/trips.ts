import type { Trip } from '$lib/types/trip';
import { writable } from 'svelte/store';

const TRIPS_KEY = 'sleeptracker_trips';

function loadTrips(): Trip[] {
	const stored = localStorage.getItem(TRIPS_KEY);
	return stored ? JSON.parse(stored) : [];
}

function createTripsStore() {
	const store = writable<Trip[]>(loadTrips());

	store.subscribe((trips) => {
		localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
	});

	return {
		...store,
		addTrip(trip: Trip) {
			store.update((trips) => [...trips, trip]);
		}
	};
}

export const trips = createTripsStore();

// ─── Derived stats ──────────────────────────────────────────

export function getStats(tripList: Trip[]) {
	const now = Date.now();
	const dayMs = 86400000;

	// Avg sleep duration
	const avgMs = tripList.length > 0
		? tripList.reduce((sum, t) => sum + t.duration, 0) / tripList.length
		: 0;

	// Streak: consecutive days (ending today or yesterday) with at least one trip
	let streak = 0;
	if (tripList.length > 0) {
		const todayStart = new Date().setHours(0, 0, 0, 0);
		let checkDay = todayStart;

		// Check if there's a trip today, otherwise start from yesterday
		const hasToday = tripList.some((t) => t.arrivedAt >= todayStart);
		if (!hasToday) checkDay -= dayMs;

		while (true) {
			const dayEnd = checkDay + dayMs;
			const hasTrip = tripList.some((t) => t.arrivedAt >= checkDay && t.arrivedAt < dayEnd);
			if (!hasTrip) break;
			streak++;
			checkDay -= dayMs;
		}
	}

	// Unique locations (rounded to ~100m precision)
	const locationKeys = new Set(
		tripList.map((t) => `${t.destination.lat.toFixed(3)},${t.destination.lng.toFixed(3)}`)
	);

	// Sleep score: based on trip frequency over last 30 days (0-100)
	const last30 = tripList.filter((t) => t.arrivedAt > now - 30 * dayMs);
	const score = Math.min(100, Math.round((last30.length / 30) * 100));

	return {
		avgSleep: avgMs,
		streak,
		locations: locationKeys.size,
		score
	};
}

export function formatDuration(ms: number): string {
	if (ms === 0) return '0m';
	const totalMin = Math.round(ms / 60000);
	const h = Math.floor(totalMin / 60);
	const m = totalMin % 60;
	if (h === 0) return `${m}m`;
	return `${h}h ${m}m`;
}

// Weekly chart: last 7 days, total sleep hours per day
export function getWeeklyChart(tripList: Trip[]): Array<{ day: string; hours: number }> {
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const result: Array<{ day: string; hours: number }> = [];

	for (let i = 6; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dayStart = new Date(date).setHours(0, 0, 0, 0);
		const dayEnd = dayStart + 86400000;

		const dayTrips = tripList.filter((t) => t.arrivedAt >= dayStart && t.arrivedAt < dayEnd);
		const totalMs = dayTrips.reduce((sum, t) => sum + t.duration, 0);

		result.push({
			day: days[date.getDay()],
			hours: totalMs / 3600000
		});
	}

	return result;
}

// Achievements derived from real data
export function getAchievements(tripList: Trip[], streak: number, locations: number) {
	return [
		{
			icon: '🏆',
			label: 'First Trip',
			desc: 'Complete your first trip',
			unlocked: tripList.length >= 1
		},
		{
			icon: '🔥',
			label: 'On a Roll',
			desc: '3-day streak',
			unlocked: streak >= 3
		},
		{
			icon: '🌍',
			label: 'Explorer',
			desc: 'Visit 3 different locations',
			unlocked: locations >= 3
		},
		{
			icon: '💤',
			label: 'Road Sleeper',
			desc: 'Complete 10 trips',
			unlocked: tripList.length >= 10
		},
		{
			icon: '⭐',
			label: 'Veteran',
			desc: 'Complete 30 trips',
			unlocked: tripList.length >= 30
		}
	];
}
