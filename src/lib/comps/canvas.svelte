<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { draw, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let numCurves: number = 2;
	export let stroke = '#000';
	export let strokeWidth = 4;
	export let opacity = 1;
	export let edgeMargin = 100;

	const IN_MS = 1200;
	const OUT_MS = 600;

	let svgEl: SVGSVGElement;
	let width = 1000;
	let height = 1000;
	let paths: string[] = [];
	let pathEls: SVGPathElement[] = [];
	let markers: { x: number; y: number }[] = [];
	let loopTimeout: number | null = null;

	function rand(max: number) {
		return Math.random() * max;
	}

	function edgePoint(edge: number): [number, number] {
		switch (edge) {
			case 0:
				return [rand(width), -edgeMargin];
			case 1:
				return [width + edgeMargin, rand(height)];
			case 2:
				return [rand(width), height + edgeMargin];
			case 3:
			default:
				return [-edgeMargin, rand(height)];
		}
	}

	function genCurve(): string {
		const startEdge = Math.floor(rand(4));
		let endEdge = Math.floor(rand(4));
		if (endEdge === startEdge) endEdge = (endEdge + 1 + Math.floor(rand(3))) % 4;

		const [x0, y0] = edgePoint(startEdge);
		const [x3, y3] = edgePoint(endEdge);

		const insetX = width * 0.15;
		const insetY = height * 0.15;
		const x1 = insetX + rand(Math.max(1, width - insetX * 2));
		const y1 = insetY + rand(Math.max(1, height - insetY * 2));
		const x2 = insetX + rand(Math.max(1, width - insetX * 2));
		const y2 = insetY + rand(Math.max(1, height - insetY * 2));

		return `M ${x0} ${y0} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
	}

	function regenerate() {
		const n = Math.min(3, Math.max(1, Math.round(numCurves)));
		paths = Array.from({ length: n }, genCurve);
		queueMarkersPlacement();
	}

	function startFadeOutAndRegen() {
		paths = [];
		markers = [];
		loopTimeout = window.setTimeout(() => {
			regenerate();
		}, OUT_MS + 50);
	}

	export function triggerRegeneration(): void {
		if (loopTimeout !== null) {
			clearTimeout(loopTimeout);
			loopTimeout = null;
		}
		startFadeOutAndRegen();
	}

	function queueMarkersPlacement() {
		Promise.resolve().then(async () => {
			await tick();
			placeRandomMarkers();
		});
	}

	function placeRandomMarkers() {
		const count = 2 + Math.floor(Math.random() * 2);
		const next: { x: number; y: number }[] = [];
		if (!pathEls || pathEls.length === 0) {
			markers = next;
			return;
		}
		for (let i = 0; i < count; i++) {
			const idx = Math.floor(Math.random() * pathEls.length);
			const p = pathEls[idx];
			if (!p) continue;
			const len = p.getTotalLength?.() ?? 0;
			if (len <= 0) continue;
			const s = Math.random() * len;
			const pt = p.getPointAtLength(s);
			next.push({ x: pt.x, y: pt.y });
		}
		markers = next;
	}

	const onResize = () => {
		if (!svgEl) return;
		const r = svgEl.getBoundingClientRect();
		width = r.width || width;
		height = r.height || height;
		regenerate();
	};

	onMount(() => {
		const rect = svgEl.getBoundingClientRect();
		width = rect.width || width;
		height = rect.height || height;
		regenerate();
	});

	onDestroy(() => {
		if (loopTimeout !== null) {
			clearTimeout(loopTimeout);
			loopTimeout = null;
		}
		window.removeEventListener('resize', onResize);
	});
</script>

<svelte:window onresize={onResize} />

<svg bind:this={svgEl} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
	{#each paths as d, i (d)}
		<path
			bind:this={pathEls[i]}
			{d}
			fill="none"
			{stroke}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
			{opacity}
			vector-effect="non-scaling-stroke"
			shape-rendering="geometricPrecision"
			in:draw={{ duration: IN_MS, easing: cubicOut }}
			out:draw={{ duration: OUT_MS, easing: cubicOut }}
		/>
	{/each}
	{#each markers as m}
		<rect
			x={m.x - 11}
			y={m.y - 11}
			width="22"
			height="22"
			fill="var(--color-primary)"
			{opacity}
			{stroke}
			stroke-width={strokeWidth}
			shape-rendering="geometricPrecision"
			in:fade={{ duration: IN_MS, easing: cubicOut, delay: 1000 }}
		/>
	{/each}
	<defs></defs>
</svg>

<style>
	svg {
		width: 100%;
		height: 100vh;
		height: 100dvh;
		pointer-events: none;
		display: block;
		shape-rendering: geometricPrecision;
		background-color: transparent;
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		right: 0;
		bottom: 0;
		z-index: 0;
		scrollbar-width: none;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	svg::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 768px) {
		svg {
			width: 100vw;
			max-width: none;
			left: 0;
			transform: none;
		}
	}
</style>
