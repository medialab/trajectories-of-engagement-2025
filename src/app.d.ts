// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module 'tempus' {
	const Tempus: {
		add: (
			callback: (time: number, deltaTime: number) => void,
			options?: { priority?: number; fps?: number | string }
		) => () => void;
		patch: () => void;
		unpatch: () => void;
		pause: () => void;
		play: () => void;
		restart: () => void;
	};
	export default Tempus;
}
