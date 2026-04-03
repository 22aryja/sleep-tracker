import type { Settings } from '$lib/types/settings';
import { writable, type Writable } from 'svelte/store';

const SETTINGS_KEY = 'sleeptracker_settings';
const DEFAULT_ALARM_RADIUS = 300;

function createSettings(): Writable<Settings> {
	const stored = localStorage.getItem(SETTINGS_KEY);
	const savedRadius = stored ? JSON.parse(stored).alarmRadius ?? DEFAULT_ALARM_RADIUS : DEFAULT_ALARM_RADIUS;

	const hasNotifications = typeof Notification !== 'undefined';

	const store = writable<Settings>({
		notifications: hasNotifications && Notification.permission === 'granted',
		allowTracking: false,
		alarmRadius: savedRadius
	});

	store.subscribe((value) => {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify({ alarmRadius: value.alarmRadius }));
	});

	if (navigator.permissions) {
		navigator.permissions.query({ name: 'geolocation' }).then((result) => {
			store.update((s) => ({ ...s, allowTracking: result.state === 'granted' }));

			result.addEventListener('change', () => {
				store.update((s) => ({ ...s, allowTracking: result.state === 'granted' }));
			});
		}).catch(() => {});
	}

	return store;
}

export const settings: Writable<Settings> = createSettings();
