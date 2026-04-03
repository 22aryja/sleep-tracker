import type { User } from '$lib/types/user';

const USER_KEY: string = 'sleeptracker_user';

export class AppUser {
	user: User = JSON.parse(localStorage.getItem(USER_KEY)!);

	get<K extends keyof User>(key: K): User[K] {
		return this.user[key];
	}

	update<K extends keyof User>(key: K, newValue: User[K]): void {
		this.user = {
			...this.user,
			[key]: newValue
		};

		localStorage.setItem(USER_KEY, JSON.stringify(this.user));
	}
}
