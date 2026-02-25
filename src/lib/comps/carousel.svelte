<script lang="ts">
	let props = $props();

	import { T, useThrelte } from '@threlte/core';
	import { useTexture, transitions, onReveal } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { interactivity, useCursor } from '@threlte/extras';
	import type { Mesh as ThreeMesh } from 'three';
	import { browser } from '$app/environment';
	import { currentTag, currentAuthor, currentResearchCenter, carouselConfig } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Lenis from 'lenis';
	import Tempus from 'tempus';

	import { isMobile, isTextureReady, getDeviceType } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { on } from 'svelte/events';

	const { invalidate } = useThrelte();

	let scrollY = $state(0);

	let scrollFactor = carouselConfig.scrollFactor;

	let deformationStrength = $state(2);

	let isMobileFlag = $derived.by(() => isMobile());

	let deviceType = $derived.by(() => getDeviceType());

	let isIntroTweening = $state(false);
	let hasIntroPlayed = $state(false);

	let windVelocity = $state(0);
	const windDamping = (carouselConfig.wind as any)?.damping ?? 0.92;
	const windEpsilon = 0.0005;

	const introDelayMs = $derived.by(() =>
		typeof (props as any)?.introDelayMs === 'number' ? (props as any).introDelayMs : 0
	);

	$effect(() => {
		if ((props as any)?.deformationStrength !== undefined) {
			deformationStrength = (props as any).deformationStrength as number;
		}
	});

	const { onPointerEnter: cursorEnter, onPointerLeave } = useCursor();

	const handlePointerEnter = (d?: any) => {
		if (isMobileFlag) return;
		cursorEnter();
		const title = typeof d?.title === 'string' && d.title.trim().length > 0 ? d.title : '';
		$currentTag = title || 'No data to be displayed';
		$currentAuthor = typeof d?.project_leaders === 'string' ? d.project_leaders : '';
		$currentResearchCenter = typeof d?.research_center === 'string' ? d.research_center : '';
	};

	let spacing = $state(10);
	let baseScale = $state(0.9);
	let baseFar = $state(10000);
	let baseNear = $state(0.001);
	let xOffset = $state(0);

	$effect(() => {
		if (deviceType === 'small') {
			baseScale = 0.7;
			spacing = 5;
		} else if (deviceType === 'medium') {
			baseScale = 0.9;
			spacing = 8;
		} else {
			baseScale = 1.1;
			spacing = 10;
		}
	});

	const startZ = carouselConfig.startZ;

	const getProjectId = (project: any) => {
		if (!project?.metadata) return '';
		const value = project.metadata.id;
		return typeof value === 'string' ? value.trim() : '';
	};

	function getPoster(id: string) {
		if (!props.posters || !id) return undefined;
		const projectPoster = props.posters[`/src/lib/assets/posters/${id}.png`];
		return projectPoster;
	}

	const projectsList = $derived.by(() => (Array.isArray(props.projects) ? props.projects : []));
	const renderableProjects = $derived.by(() =>
		projectsList
			.map((project: any) => {
				const id = getProjectId(project);
				const poster = id ? getPoster(id) : undefined;
				return { project, id, poster };
			})
			.filter((item: { id: string; poster?: string }) => item.id && item.poster)
	);
	const renderCount = $derived.by(() => renderableProjects.length);
	const initialTextureBatch = $derived.by(() => (isMobileFlag ? 4 : 6));
	const textureBatchStep = $derived.by(() => (isMobileFlag ? 2 : 3));
	const textureBatchIntervalMs = 160;
	let stagedTextureCount = $state(0);
	let loadedTextureById = $state<Record<string, boolean>>({});
	let textureBatchTimer: number | null = null;
	const criticalTextureCount = $derived.by(() =>
		Math.min(renderableProjects.length, Math.max(1, initialTextureBatch))
	);
	const criticalTextureIds = $derived.by((): string[] =>
		renderableProjects.slice(0, criticalTextureCount).map((item: { id: string }) => item.id)
	);
	const loadedCriticalTextureCount = $derived.by(() =>
		criticalTextureIds.reduce(
			(count: number, id: string) => count + (loadedTextureById[id] ? 1 : 0),
			0
		)
	);
	const hasMissingData = $derived.by(
		() => projectsList.length > 0 && renderableProjects.length < projectsList.length
	);

	const groupTotalLength = $derived.by(() => renderCount * spacing);
	const middleZ = $derived.by(() => startZ + Math.floor(renderCount / 2) * spacing);

	let meshes: ThreeMesh[] = [];

	const meshRand = new WeakMap<
		ThreeMesh,
		{
			curlScale: number;
			thresholdShift: number;
			edgePower: number;
			dirScale: number;
			windScale: number;
			oscAmp: number;
			oscFreq: number;
			oscPhase: number;
		}
	>();

	let hoverToScale = $state<number[]>([]);
	let targetScaleByIndex = $state<number[]>([]);
	let hoverAnimFrame: number | null = null;

	$effect(() => {
		hoverToScale = Array(renderCount).fill(0);
		targetScaleByIndex = Array(renderCount).fill(0);
	});

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
		if (index < 0 || index >= targetScaleByIndex.length) return;
		targetScaleByIndex[index] = value;
		if (hoverAnimFrame === null) hoverAnimFrame = requestAnimationFrame(animateHoverScales);
	}

	function shouldLoadTexture(index: number) {
		return index < stagedTextureCount;
	}

	function markTextureLoaded(id: string) {
		if (!id || loadedTextureById[id]) return;
		loadedTextureById = {
			...loadedTextureById,
			[id]: true
		};
	}

	const originalZByMesh = new WeakMap<ThreeMesh, Float32Array>();

	function cardBoundTeleport(zValue: number): number {
		const total = groupTotalLength;
		if (total <= 0) return startZ;
		const min = startZ;
		const max = startZ + total;
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

			const geomParams = (mesh.geometry as any)?.parameters ?? {};
			const width = typeof geomParams.width === 'number' ? geomParams.width : 1;
			const height = typeof geomParams.height === 'number' ? geomParams.height : 1;
			const halfW = width / 2;
			const halfH = height / 2;

			const maxBend = carouselConfig.wind.maxCurl * Math.max(0, deformationStrength);
			const verticalCurvePower = 2.0;

			const vertexCount = position.count;
			for (let i = 0; i < vertexCount; i++) {
				const x = position.getX(i);
				const y = position.getY(i);
				const ny = y / Math.max(1e-6, halfH);

				const t = Math.min(1, Math.max(0, (ny + 1) * 0.5));
				const weight = -Math.pow(1 - t, verticalCurvePower);

				const bend = weight * maxBend * r.windScale * windStrength;
				position.setZ(i, baseZ[i] + bend);
			}
			position.needsUpdate = true;
			mesh.geometry.computeVertexNormals?.();
		}
		invalidate();
	}

	interactivity({ target: props.containerEl });

	$effect(() => {
		const total = renderableProjects.length;
		const initialStagedCount = Math.min(total, Math.max(1, initialTextureBatch));
		let nextCount = initialStagedCount;
		loadedTextureById = {};
		stagedTextureCount = initialStagedCount;
		if (textureBatchTimer !== null) {
			clearInterval(textureBatchTimer);
			textureBatchTimer = null;
		}
		if (!browser || initialStagedCount >= total) return;
		textureBatchTimer = window.setInterval(() => {
			nextCount = Math.min(total, nextCount + Math.max(1, textureBatchStep));
			stagedTextureCount = nextCount;
			if (nextCount >= total && textureBatchTimer !== null) {
				clearInterval(textureBatchTimer);
				textureBatchTimer = null;
			}
		}, textureBatchIntervalMs);

		return () => {
			if (textureBatchTimer !== null) {
				clearInterval(textureBatchTimer);
				textureBatchTimer = null;
			}
		};
	});

	$effect(() => {
		const required = criticalTextureIds.length;
		$isTextureReady = required === 0 ? true : loadedCriticalTextureCount >= required;
	});

	$effect(() => {
		if (!$isTextureReady || !props.loadstatus) {
			hasIntroPlayed = false;
			if (introTimer !== null) {
				clearTimeout(introTimer);
				introTimer = null;
			}
			if ($isTextureReady) scheduleApply();
			return;
		}
		scheduleApply();
		if (!hasIntroPlayed) {
			hasIntroPlayed = true;
			if (introTimer !== null) clearTimeout(introTimer);
			introTimer = window.setTimeout(
				() => {
					introTimer = null;
					if (!$isTextureReady || !props.loadstatus) return;
					startIntroNudge();
				},
				Math.max(0, introDelayMs)
			);
		}
	});

	let lenis: Lenis | null = null;
	let unsubscribeLenis: (() => void) | null = null;

	let pendingDelta = $state(0);
	let scrollRAF: number | null = $state(null);
	let introTimer: number | null = null;

	const startIntroNudge = () => {
		if (isIntroTweening) return;
		isIntroTweening = true;
		const duration = 800;
		const amplitude = 140;
		let last = 0;
		const start = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = cubicOut(t);
			const target = eased * amplitude;
			const delta = target - last;
			last = target;
			pendingDelta += delta;
			scheduleApply();
			if (t < 1) {
				requestAnimationFrame(step);
			} else {
				isIntroTweening = false;
			}
		};
		requestAnimationFrame(step);
	};

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
		if (introTimer !== null) clearTimeout(introTimer);
		if (textureBatchTimer !== null) clearInterval(textureBatchTimer);
		$isTextureReady = false;
	});
</script>

{#snippet posterMesh(item: any, index: number, map?: any)}
	{@const project = item.project}
	<T.Group
		plugins={[transitions]}
		initial={false}
		in={fly}
		transition={{ y: -20, duration: 1500, delay: 100 * index + 100, easing: cubicOut }}
	>
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
				handlePointerEnter(project?.metadata);
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
				const resolvedPath = resolve(`/projects/${item.id}`);
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
			{#if map}
				<T.MeshBasicMaterial {map} toneMapped={false} />
			{:else}
				<T.MeshBasicMaterial color="#d5d5d5" toneMapped={false} />
			{/if}
		</T.Mesh>
	</T.Group>
{/snippet}

{#if renderCount === 0}
	<div class="carousel_notice">No data to be displayed</div>
{:else if renderCount !== 0 && props.loadstatus}
	<T.Group rotation={[0.3, -0.5, 0]}>
		{#each renderableProjects as item, index}
			{@const poster = item.poster}
			{#if shouldLoadTexture(index)}
				{@const texture = useTexture(poster as string)
					.then((loadedTexture) => {
						markTextureLoaded(item.id);
						return loadedTexture;
					})
					.catch((error) => {
						markTextureLoaded(item.id);
						throw error;
					})}
				{#await texture then map}
					{@render posterMesh(item, index, map)}
				{:catch}
					{@render posterMesh(item, index, undefined)}
				{/await}
			{:else}
				{@render posterMesh(item, index, undefined)}
			{/if}
		{/each}
	</T.Group>
{/if}

<T.OrthographicCamera
	position={[-20 + xOffset, -6, middleZ + 15]}
	rotation={[-0.1, 0.1, 0]}
	zoom={40}
	makeDefault
	far={baseFar}
	near={baseNear}
	fov={1}
></T.OrthographicCamera>

<T.AmbientLight intensity={1000} color="white" />

{#if hasMissingData}
	<div class="carousel_notice subtle">Some items have no data to display</div>
{/if}

<style>
	.carousel_notice {
		position: fixed;
		top: var(--space-xl);
		left: 50%;
		transform: translateX(-50%);
		padding: var(--space-xs) var(--space-m);
		background-color: var(--primary-light);
		font-size: 14px;
		z-index: 2;
		pointer-events: none;
	}

	.carousel_notice.subtle {
		top: auto;
		bottom: var(--space-xl);
		font-size: 12px;
		opacity: 0.7;
	}
</style>
