declare global {
	namespace App {}
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
