<script lang="ts">
	let props = $props();

	import { T, useThrelte } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { interactivity, useCursor } from '@threlte/extras';
	import type { Mesh as ThreeMesh } from 'three';
	import { browser } from '$app/environment';
	import { currentTag, currentAuthor, currentResearchCenter, carouselConfig } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Tween } from 'svelte/motion';
	import Lenis from 'lenis';
	// @ts-ignore - types provided via ambient module until package is installed
	import Tempus from 'tempus';

	import { isMobile, isTextureReady } from '$lib/utils';

	const { invalidate } = useThrelte();

	// Removed LocomotiveScroll; we drive scroll from wheel/touch directly

	let scrollY = $state(0);

	let scrollFactor = carouselConfig.scrollFactor;

	let deformationStrength = $state(2);

	let isMobileFlag = $derived.by(() => isMobile());

	let isIntroTweening = $state(false);

	// Smoothed wind velocity for visible curl/lerp, esp. on mobile
	let windVelocity = $state(0); // not reactive on purpose
	const windDamping = (carouselConfig.wind as any)?.damping ?? 0.92;
	const windEpsilon = 0.0005;

	$effect(() => {
		if ((props as any)?.deformationStrength !== undefined) {
			deformationStrength = (props as any).deformationStrength as number;
		}
	});

	const { onPointerEnter: cursorEnter, onPointerLeave } = useCursor();

	const handlePointerEnter = (d: any) => {
		if (isMobileFlag) return;
		cursorEnter();
		//console.log(d);
		$currentTag = d.id;
		$currentAuthor = d.project_leaders;
		$currentResearchCenter = d.research_center;
	};

	let spacing = carouselConfig.spacing;
	let baseScale = $state(0.9);

	$effect(() => {
		if (isMobileFlag) {
			baseScale = 0.7;
		} else {
			baseScale = 0.9;
		}
	});

	const startZ = carouselConfig.startZ;
	const groupTotalLength = props.projects.length * spacing;
	const middleZ = startZ + Math.floor(props.projects.length / 2) * spacing;

	let meshes: ThreeMesh[] = [];

	const meshRand = new WeakMap<
		ThreeMesh,
		{
			curlScale: number;
			thresholdShift: number;
			edgePower: number;
			dirScale: number;
			windScale: number;
			// additional per-mesh variance
			oscAmp: number; // 0..~0.2
			oscFreq: number; // small frequency factor applied to scrollY
			oscPhase: number; // 0..2PI
		}
	>();

	let hoverToScale = $state<number[]>(Array(props.projects.length).fill(0));
	let targetScaleByIndex = $state<number[]>(Array(props.projects.length).fill(0));
	let hoverAnimFrame: number | null = null;

	function animateHoverScales() {
		hoverAnimFrame = null;
		let needsAnotherFrame = false;
		for (let i = 0; i < hoverToScale.length; i++) {
			const current = hoverToScale[i];
			const target = targetScaleByIndex[i];
			const delta = target - current;

			if (Math.abs(delta) > 0.001) {
				hoverToScale[i] = current + delta * carouselConfig.hover.ease;
				needsAnotherFrame = true;
			} else if (current !== target) {
				hoverToScale[i] = target;
			}
		}
		if (needsAnotherFrame) {
			hoverAnimFrame = requestAnimationFrame(animateHoverScales);
		}
	}

	function setHoverTarget(index: number, value: number) {
		targetScaleByIndex[index] = value;
		if (hoverAnimFrame === null) hoverAnimFrame = requestAnimationFrame(animateHoverScales);
	}

	const originalZByMesh = new WeakMap<ThreeMesh, Float32Array>();

	function cardBoundTeleport(zValue: number): number {
		const min = startZ;
		const max = startZ + groupTotalLength;
		const range = max - min;
		return ((((zValue - min) % range) + range) % range) + min;
	}

	function deformMeshes(scrollDelta: number) {
		const s = Math.max(-1, Math.min(1, scrollDelta * carouselConfig.wind.deltaMultiplier));
		const windStrength = Math.sign(s) * cubicOut(Math.abs(s));

		for (const mesh of meshes) {
			const position = mesh?.geometry?.attributes?.position;
			if (!position) continue;

			const r = meshRand.get(mesh) ?? {
				windScale: 1
			};

			let baseZ = originalZByMesh.get(mesh);
			if (!baseZ || baseZ.length !== position.count) {
				baseZ = new Float32Array(position.count);
				for (let i = 0; i < position.count; i++) baseZ[i] = position.getZ(i);
				originalZByMesh.set(mesh, baseZ);
			}

			// Geometry parameters to normalize coordinates
			const geomParams = (mesh.geometry as any)?.parameters ?? {};
			const width = typeof geomParams.width === 'number' ? geomParams.width : 1;
			const height = typeof geomParams.height === 'number' ? geomParams.height : 1;
			const halfW = width / 2;
			const halfH = height / 2;

			// Bottom-edge bend with half-parabola vertical falloff
			const maxBend = carouselConfig.wind.maxCurl * Math.max(0, deformationStrength);
			const verticalCurvePower = 2.0; // 1.5..3.0: higher -> more concentrated near bottom

			const vertexCount = position.count;
			for (let i = 0; i < vertexCount; i++) {
				const x = position.getX(i);
				const y = position.getY(i);

				const nx = x / Math.max(1e-6, halfW); // -1..1, corners have |nx| ~ 1
				const ny = y / Math.max(1e-6, halfH); // -1 bottom .. 1 top

				// Vertical half-parabola: uniform across X
				const t = Math.min(1, Math.max(0, (ny + 1) * 0.5)); // bottom=0 .. top=1
				const weight = Math.pow(1 - t, verticalCurvePower);

				const bend = weight * maxBend * r.windScale * windStrength;
				position.setZ(i, baseZ[i] + bend);
			}
			position.needsUpdate = true;
			mesh.geometry.computeVertexNormals?.();
		}
		invalidate();
	}

	function getPoster(id: string) {
		if (!props.posters || !id) return undefined;
		const projectPoster = props.posters[`/src/lib/assets/posters/${id}.png`];
		return projectPoster;
	}

	interactivity({ target: props.containerEl });

	$effect(() => {
		if ($isTextureReady && !isIntroTweening) {
			scheduleApply();
		}
	});

	let lenis: Lenis | null = null;
	let unsubscribeLenis: (() => void) | null = null;

	let pendingDelta = $state(0);
	let scrollRAF: number | null = $state(null);

	const scheduleApply = () => {
		if (scrollRAF !== null) return;

		scrollRAF = requestAnimationFrame(() => {
			scrollRAF = null;
			const prev = scrollY;
			if (pendingDelta !== 0) {
				scrollY = prev + pendingDelta * scrollFactor;
				windVelocity += pendingDelta;
				pendingDelta = 0;
			}
			if (Math.abs(windVelocity) > windEpsilon) {
				deformMeshes(windVelocity);
				windVelocity *= windDamping;
				if (scrollRAF === null) scheduleApply();
			}
		});
	};

	onMount(async () => {
		if (!browser) return;

		lenis = new Lenis({
			autoRaf: false,
			smoothWheel: true,
			infinite: true,
			orientation: 'vertical',
			easing: cubicOut,
			lerp: 0.5,
			syncTouch: true,
			touchMultiplier: 7
		});

		unsubscribeLenis =
			Tempus.add(
				(time: number) => {
					lenis?.raf(time);
				},
				{ priority: -1 }
			) ?? null;

		lenis.on('scroll', (e) => {
			pendingDelta += e.velocity;
		});
	});

	onDestroy(() => {
		if (lenis) lenis.destroy();
		if (unsubscribeLenis) unsubscribeLenis();
		if (scrollRAF !== null) cancelAnimationFrame(scrollRAF);
		if (hoverAnimFrame !== null) cancelAnimationFrame(hoverAnimFrame);
	});
</script>

<T.Group rotation={[0.3, -0.5, 0]}>
	{#each props.projects as project, index}
		{@const poster = getPoster(project.metadata.id)}
		{#if poster}
			{@const texture = useTexture(poster as string).then((texture) => texture)}
			{#await texture then map}
				{($isTextureReady = true)}
				<T.Mesh
					position={[0, 0, cardBoundTeleport(startZ + index * spacing + scrollY)]}
					scale={[baseScale + hoverToScale[index], baseScale + hoverToScale[index], baseScale]}
					rotation={[0, 0, 0]}
					oncreate={(value) => {
						if (value && !meshes.includes(value)) {
							meshes.push(value);
							const rand = (min: number, max: number) => Math.random() * (max - min) + min;
							meshRand.set(value as any, {
								curlScale: rand(
									carouselConfig.randomness.curlScale[0],
									carouselConfig.randomness.curlScale[1]
								),
								thresholdShift: rand(
									carouselConfig.randomness.thresholdShift[0],
									carouselConfig.randomness.thresholdShift[1]
								),
								edgePower: rand(
									carouselConfig.randomness.edgePower[0],
									carouselConfig.randomness.edgePower[1]
								),
								dirScale: rand(
									carouselConfig.randomness.dirScale[0],
									carouselConfig.randomness.dirScale[1]
								),
								windScale: rand(
									carouselConfig.randomness.windScale[0],
									carouselConfig.randomness.windScale[1]
								),
								oscAmp: rand(0.05, 0.18),
								oscFreq: rand(0.004, 0.012),
								oscPhase: rand(0, Math.PI * 2)
							});
						}
					}}
					onpointerenter={(e: any) => {
						if (!$isTextureReady) return;
						e.stopPropagation();
						setHoverTarget(index, carouselConfig.hover.scale);
						handlePointerEnter(project.metadata);
						props.onHoverPoster?.();
					}}
					onpointerleave={(e: any) => {
						if (!$isTextureReady) return;
						e.stopPropagation();
						setHoverTarget(index, 0);
						onPointerLeave();
					}}
					onclick={(e: any) => {
						e.stopPropagation();
						if (!$isTextureReady) return;
						const resolvedPath = resolve(`/projects/${project.metadata.id}`);
						goto(resolvedPath);
					}}
					interactive={true}
					castShadow={true}
					receiveShadow={true}
				>
					<T.BoxGeometry
						args={[
							carouselConfig.card.width,
							carouselConfig.card.width * carouselConfig.card.aspectRatio,
							carouselConfig.card.depth,
							carouselConfig.card.segments.width,
							carouselConfig.card.segments.height,
							carouselConfig.card.segments.depth
						]}
					/>
					<T.MeshBasicMaterial {map} toneMapped={false} />
				</T.Mesh>
			{/await}
		{/if}
	{/each}
</T.Group>

<T.OrthographicCamera
	position={[-20, -6, middleZ + 15]}
	rotation={[-0.1, 0.1, 0]}
	zoom={40}
	makeDefault
	far={10000}
	near={0.001}
	fov={10}
></T.OrthographicCamera>

<T.AmbientLight intensity={1000} color="white" />
