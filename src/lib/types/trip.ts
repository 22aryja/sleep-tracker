export interface Trip {
	startedAt: number; // timestamp: when destination was set
	arrivedAt: number; // timestamp: when alarm fired
	duration: number; // ms between start and arrival
	destination: { lat: number; lng: number };
}
