<script lang="ts">

    let props = $props();
    let isLoaded: boolean = $state(false);

	import {  T } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
    import { onMount, onDestroy } from 'svelte'
    import { interactivity, useCursor, HTML as HTMl } from '@threlte/extras'
    import type { Mesh as ThreeMesh } from 'three'
    import { browser } from '$app/environment'; 
    import { currentTag, currentAuthor, currentResearchCenter, carouselConfig } from '$lib/utils';
    import { goto } from '$app/navigation'
    import { isMobile } from '$lib/utils';

    // Removed LocomotiveScroll; we drive scroll from wheel/touch directly
	let scrollY = $state(0);
    let scrollFactor = (carouselConfig.scrollFactor);

	let deformationStrength = $state(2);
    let cursorTag: HTMLElement;

    let isMobileFlag = $derived.by(() => isMobile());

	$effect(() => {
		if ((props as any)?.deformationStrength !== undefined) {
			deformationStrength = (props as any).deformationStrength as number;
		}
	});

	const { onPointerEnter: cursorEnter, onPointerLeave } = useCursor();

    const handlePointerEnter = (d: any) => {
        if (isMobileFlag) return;
        cursorEnter();
        console.log(d);
        $currentTag = d.id;
        $currentAuthor = d.project_leaders;
        $currentResearchCenter = d.research_center;
    }

    let spacing = (carouselConfig.spacing);
    const startZ = carouselConfig.startZ;
    const groupTotalLength = props.projects.length * spacing;
    const middleZ = startZ + Math.floor(props.projects.length / 2) * spacing;

    let meshes: ThreeMesh[] = [];
    // Per-mesh randomized deformation parameters
    const meshRand = new WeakMap<ThreeMesh, { curlScale: number; thresholdShift: number; edgePower: number; dirScale: number; windScale: number }>();
    // Per-card hover scale offsets and targets (smoothly animated)
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
                // simple ease
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
        return (((zValue - min) % range) + range) % range + min;
    }


    function deformMeshes(scrollDelta: number) {
        const windStrength = Math.max(-1, Math.min(1, scrollDelta * carouselConfig.wind.deltaMultiplier));

		for (const mesh of meshes) {
            const position = mesh?.geometry?.attributes?.position;
			if (!position) continue;

            const r = meshRand.get(mesh) ?? { curlScale: 1, thresholdShift: 0, edgePower: 1, dirScale: 1, windScale: 1 };

			// Cache baseline Z positions for this mesh to avoid cumulative deformation
			let baseZ = originalZByMesh.get(mesh);
			if (!baseZ || baseZ.length !== position.count) {
				baseZ = new Float32Array(position.count);
				for (let i = 0; i < position.count; i++) baseZ[i] = position.getZ(i);
				originalZByMesh.set(mesh, baseZ);
			}

			// Read plane size from geometry parameters (fallback to 1x1 if unavailable)
			const geomParams = (mesh.geometry as any)?.parameters ?? {};
			const width = typeof geomParams.width === 'number' ? geomParams.width : 1;
			const height = typeof geomParams.height === 'number' ? geomParams.height : 1;
			const halfW = width / 2;
			const halfH = height / 2;

            // Rounded falloff from inner region to edges using max-norm (square radius)
            // threshold defines the inner area with no curl; lower => wider curl area
            const threshold = carouselConfig.wind.thresholdBase + r.thresholdShift; // 0..1 with per-mesh shift

			const vertexCount = position.count;
			for (let i = 0; i < vertexCount; i++) {
				const x = position.getX(i);
				const y = position.getY(i);

				let zOffset = 0;
				const ax = Math.abs(x) / Math.max(1e-6, halfW);
				const ay = Math.abs(y) / Math.max(1e-6, halfH);
				const m = Math.max(ax, ay); // 0 at center .. 1 at edges/corners
				let t = (m - threshold) / Math.max(1e-6, 1 - threshold);
				t = Math.min(1, Math.max(0, t));
                let s = t * t * (3 - 2 * t); // smoothstep
                s = Math.pow(s, 1 + Math.max(0, r.edgePower)); // per-mesh rounding power
                const maxCurl = carouselConfig.wind.maxCurl; // base amplitude
                zOffset = s * maxCurl * r.curlScale * (windStrength * r.windScale) * Math.max(0, deformationStrength);
				// Smoothly vary curl direction across X (gentler near center)
				const nxEdge = x / Math.max(1e-6, halfW); // -1 .. 1
				const sign = nxEdge >= 0 ? -1 : 1; // right negative, left positive
				const a = Math.min(1, Math.abs(nxEdge));
				const eased = a * a * (3 - 2 * a); // smoothstep
                let dir = sign * eased * r.dirScale;
                dir = Math.max(-1, Math.min(1, dir));
				zOffset *= dir;

				position.setZ(i, baseZ[i] + zOffset);
			}
			position.needsUpdate = true;
			mesh.geometry.computeVertexNormals?.();
		}
    }

    interactivity(
        {target: props.containerEl}
    );

    onMount(() => {
        if (!browser) return;

        let lastX = 0;
        let lastY = 0;
        let rafId: number | null = null;
        
        const moveHandler = (e: MouseEvent) => {
            lastX = e.clientX;
            lastY = e.clientY;
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    rafId = null;
                    if (cursorTag) {
                        cursorTag.style.transform = `translate(${lastX}px, ${lastY}px)`;
                    }
                });
            }
        };

        document.addEventListener('mousemove', moveHandler, { passive: true });

        // Accumulate deltas and apply once per frame
        let pendingDelta = 0;
        let scrollRAF: number | null = null;
        const scheduleApply = () => {
            if (scrollRAF !== null) return;
            scrollRAF = requestAnimationFrame(() => {
                scrollRAF = null;
                if (pendingDelta !== 0) {
                    const prev = scrollY;
                    scrollY = prev + pendingDelta * scrollFactor;
                    deformMeshes(pendingDelta);
                    pendingDelta = 0;
                }
            });
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const m = isMobileFlag ? carouselConfig.multipliers.wheelMobile : carouselConfig.multipliers.wheelDesktop;
            pendingDelta += e.deltaY * m;
            scheduleApply();
        };

        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
        const onTouchMove = (e: TouchEvent) => {
            const yNow = e.touches[0]?.clientY ?? 0;
            const dy = touchY - yNow;
            const m = isMobileFlag ? carouselConfig.multipliers.touchMobile : carouselConfig.multipliers.touchDesktop;
            pendingDelta += dy * m;
            scheduleApply();
            touchY = yNow;
        };

        const target = props.containerEl ?? window;
        target.addEventListener('wheel', onWheel, { passive: false });
        target.addEventListener('touchstart', onTouchStart, { passive: true });
        target.addEventListener('touchmove', onTouchMove, { passive: true });

        setTimeout(() => {
            isLoaded = true;
        }, 1000);

        onDestroy(() => {
            target.removeEventListener('wheel', onWheel as any);
            target.removeEventListener('touchstart', onTouchStart as any);
            target.removeEventListener('touchmove', onTouchMove as any);
        });
    });

    // cursor move handler is removed in onMount cleanup above
</script>


<T.Group
rotation={[0.3, -0.5, 0]}
>

        {#each props.projects as project, index}
        {@const poster = `/src/lib/assets/posters/${project.metadata.id}.png`}
        {@const texture = useTexture(poster).then(texture => texture)}
            {#await texture then map}
                    <T.Mesh
                        position={[0, 0, cardBoundTeleport(startZ + (index * spacing) + scrollY)]}
                        scale={[1 + hoverToScale[index], 1 + hoverToScale[index], 1]}
                        rotation={[0, 0, 0]}
                        oncreate={(value) => {
                            if (value && !meshes.includes(value)) {
                                meshes.push(value);
                                // assign per-mesh randomized params once
                                const rand = (min: number, max: number) => Math.random() * (max - min) + min;
                                meshRand.set(value as any, {
                                    curlScale: rand(carouselConfig.randomness.curlScale[0], carouselConfig.randomness.curlScale[1]),
                                    thresholdShift: rand(carouselConfig.randomness.thresholdShift[0], carouselConfig.randomness.thresholdShift[1]),
                                    edgePower: rand(carouselConfig.randomness.edgePower[0], carouselConfig.randomness.edgePower[1]),
                                    dirScale: rand(carouselConfig.randomness.dirScale[0], carouselConfig.randomness.dirScale[1]),
                                    windScale: rand(carouselConfig.randomness.windScale[0], carouselConfig.randomness.windScale[1])
                                });
                            }
                        }}
                        onpointerenter={(e: any) => {
                                e.stopPropagation();
                                setHoverTarget(index, carouselConfig.hover.scale);
                                handlePointerEnter(project.metadata);
                                props.onHoverPoster?.();
                            }}
                            onpointerleave={(e: any) => {
                                e.stopPropagation();
                                setHoverTarget(index, 0);
                                onPointerLeave();
                            }} 
                        onclick={(e: any) => {
                            e.stopPropagation();
                            goto(`/projects/${project.metadata.id}`);
                        }}
                        interactive={true}
                        castShadow={true}
                        receiveShadow={true}
                        >
                            <T.BoxGeometry args={[
                                carouselConfig.card.width,
                                carouselConfig.card.width * carouselConfig.card.aspectRatio,
                                carouselConfig.card.depth,
                                carouselConfig.card.segments.width,
                                carouselConfig.card.segments.height,
                                carouselConfig.card.segments.depth
                            ]} />
                            <T.MeshBasicMaterial 
                                map={map}
                                toneMapped={false}
                            />
                    </T.Mesh>
            {/await}
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
>
</T.OrthographicCamera>

<T.AmbientLight intensity={1000} color="white" />

    <div id="cursorTrack" bind:this={cursorTag}>
        Tada!
    </div>

<style>

    #cursorTrack {
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-9999px, -9999px);
        pointer-events: none;
        z-index: 50;
        width: auto;
        height: auto;
        padding: 2px 6px;
        background: rgba(255, 0, 0, 0.85);
        color: #fff;
        font-size: 12px;
        border-radius: 4px;
        white-space: nowrap;
    }

    

    

    /* removed unused selectors */

</style>