import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export let currentTag = writable(undefined);
export let currentAuthor = writable('');
export let currentResearchCenter = writable('');
export let menuOpen = writable(false);
export let isTextureReady = writable(false);

export const isMobile = () => {
	if (!browser) return false;
	return window.innerWidth < 768;
};

// Centralized configuration for the carousel component
export const carouselConfig = {
	// Spacing between cards along the Z axis and starting Z
	spacing: 7,
	startZ: 5,

	// Scroll -> movement scaling
	scrollFactor: 0.01,

	// Input sensitivity multipliers for different devices
	multipliers: {
		wheelDesktop: 1,
		wheelMobile: 5,
		touchDesktop: 1,
		touchMobile: 1.5
	},

	// Hover interaction
	hover: {
		scale: 0.2, // additional scale on hover (uniform on X/Y)
		ease: 0.2 // easing factor for hover scale interpolation
	},

	// Card geometry and tessellation (affects deformation quality)
	card: {
		width: 12,
		aspectRatio: 1.3, // height = width * aspectRatio
		depth: 0.1,
		segments: {
			width: 24,
			height: 32,
			depth: 2
		}
	},

	// Group transform for the whole carousel
	group: {
		rotation: [0.3, -0.5, 0] as [number, number, number]
	},

	// Camera configuration; Z uses middleZ + zOffset at runtime
	camera: {
		positionXY: [-20, -6] as [number, number],
		zOffset: 15,
		rotation: [-0.1, 0.1, 0] as [number, number, number],
		zoom: 40,
		near: 0.001,
		far: 10000,
		fov: 10
	},

	// Wind/deformation parameters
	wind: {
		// Map wheel/touch delta to wind strength and clamp internally to [-1, 1]
		deltaMultiplier: 0.01,
		// Base curl amplitude near edges before per-mesh scaling
		maxCurl: 0.45,
		// Base threshold for inner flat region (0..1), lower => wider curl area
		thresholdBase: 0.35
	},

	// Per-mesh randomness ranges to add variation across cards
	randomness: {
		curlScale: [0.8, 1.2] as [number, number],
		thresholdShift: [-0.08, 0.08] as [number, number],
		edgePower: [0, 1.5] as [number, number],
		dirScale: [0.8, 1.2] as [number, number],
		windScale: [0.8, 1.2] as [number, number]
	}
} as const;
