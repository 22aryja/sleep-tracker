export type Plan = 'free' | 'paid';

export interface AuthUser {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	age: number;
	city: string;
	plan: Plan;
}

export const authState = $state<{ user: AuthUser | null; ready: boolean }>({
	user: null,
	ready: false
});

export function initAuth() {
	const stored = localStorage.getItem('sleeptracker_user');
	authState.user = stored ? JSON.parse(stored) : null;
	authState.ready = true;
}

export function saveUser(user: AuthUser) {
	authState.user = user;
	localStorage.setItem('sleeptracker_user', JSON.stringify(user));
}

export function logout() {
	authState.user = null;
	localStorage.removeItem('sleeptracker_user');
}
