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
		deltaMultiplier: 0.006,
		maxCurl: 2,
		thresholdBase: 0.35,
		damping: 0.32
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

export let baseUrl = 'https://trajectories.sciencespo.fr';

export let ogDescription =
	`Participatory research is no longer an option; it’s an injunction. While the social consequences of this approach are often described through their effects on so-called participants, what happens to the scholars themselves, those who are moved, reshaped, or even implicated in these processes? And how do they navigate the constraints of a research model that has become both fashionable and mandatory? This work brings together more than twenty research projects from across diverse disciplines, each experimenting with participatory and collaborative forms of inquiry. Rather than prescribing what engagement should be, it investigates how it happens: the sparks that ignite it, the frictions that sustain or destabilise it, and the material and institutional conditions that make it possible or constrain it. Research projects are described through open-ended trajectories, negotiated in the heat of genuine encounters between institutions, publics, and material infrastructures. Born from an international meeting held at the University Paris Nanterre in September 2023, this collective work extends a shared effort to think through the trajectories of engagement that characterise today’s research landscape. Combining conceptual reflection with diagrammatic elicitation methodologies, it maps how researchers and non-academic actors move, connect, and transform one another throughout the research process. At once analytical and experimental, this volume invites readers to question the forms, ethics, and politics of participation. Rather than approaching engagement as a fixed model or moral ideal, it proposes reframing it as a dynamic, situated practice.`;
export let ogTitle = 'Trajectories of Engagement';
