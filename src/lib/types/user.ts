export interface User {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	age: number;
	city: string;
	plan: 'free' | 'paid';
}
