import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import Lenis from 'lenis';
import { cubicOut } from 'svelte/easing';
import { tick } from 'svelte';
import site from '$lib/site.json';

export let currentTag = writable<string>('');
export let currentAuthor = writable<string>('');
export let currentResearchCenter = writable<string>('');
export let menuOpen = writable(false);
export let isTextureReady = writable(false);

export const isMobile = () => {
	if (!browser) return false;
	return window.innerWidth < 768;
};

export const getDeviceType = () => {
	if (!browser) return false;

	if (window.innerWidth < 768) {
		return 'small';
	} else if (window.innerWidth > 768 && window.innerWidth < 1920) {
		return 'medium';
	} else {
		return 'big';
	}
};

export const setupLenis = async (
	scrollContainer?: HTMLElement,
	signal?: AbortSignal
): Promise<Lenis | null> => {
	if (!browser || signal?.aborted) return null;

	const lenis = new Lenis({
		autoRaf: true,
		smoothWheel: true,
		orientation: 'vertical',
		easing: cubicOut,
		lerp: 0.5,
		syncTouch: true,
		touchMultiplier: 2,
		wrapper: scrollContainer ? scrollContainer : window,
		content: scrollContainer ? undefined : document.body
	});

	if (signal?.aborted) {
		lenis.destroy();
		return null;
	}

	lenis.start();
	await tick();

	if (signal?.aborted) {
		lenis.destroy();
		return null;
	}

	lenis.resize();

	return lenis;
};

export const carouselConfig = {
	startZ: 5,

	scrollFactor: 0.01,

	hover: {
		scale: 0.2,
		ease: 0.2
	},

	card: {
		width: 12,
		aspectRatio: 1.3,
		depth: 0.1,
		segments: {
			width: 24,
			height: 32,
			depth: 2
		}
	},

	group: {
		rotation: [0.3, -0.5, 0] as [number, number, number]
	},

	camera: {
		positionXY: [-20, -6] as [number, number],
		zOffset: 15,
		rotation: [-0.1, 0.1, 0] as [number, number, number],
		zoom: 40,
		near: 0.001,
		far: 10000,
		fov: 10
	},

	wind: {
		deltaMultiplier: 0.006,
		maxCurl: 2,
		thresholdBase: 0.35,
		damping: 0.32
	},

	randomness: {
		curlScale: [0.8, 1.2] as [number, number],
		thresholdShift: [-0.08, 0.08] as [number, number],
		edgePower: [0, 1.5] as [number, number],
		dirScale: [0.8, 1.2] as [number, number],
		windScale: [0.8, 1.2] as [number, number]
	}
} as const;

export let baseUrl = site.baseUrl;

export let ogDescription = site.description;
export let ogTitle = site.siteName;
