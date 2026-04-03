import type { Settings } from '$lib/types/settings';
import { writable, type Writable } from 'svelte/store';

function createSettings(): Writable<Settings> {
	const store = writable<Settings>({
		notifications: Notification.permission === 'granted',
		allowTracking: false
	});

	navigator.permissions.query({ name: 'geolocation' }).then((result) => {
		store.update((s) => ({ ...s, allowTracking: result.state === 'granted' }));

		result.addEventListener('change', () => {
			store.update((s) => ({ ...s, allowTracking: result.state === 'granted' }));
		});
	});

	return store;
}

export const settings: Writable<Settings> = createSettings();
