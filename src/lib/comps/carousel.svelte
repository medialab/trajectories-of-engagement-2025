<script lang="ts">

    let props = $props();

    import schema_original from '$lib/assets/posters/schema_original.png';
    import schema_original_1 from '$lib/assets/posters/schema_original-1.png';
    import schema_original_2 from '$lib/assets/posters/schema_original-2.png';
    import schema_original_3 from '$lib/assets/posters/schema_original-3.png';
    import schema_original_4 from '$lib/assets/posters/schema_original-4.png';
    import schema_original_5 from '$lib/assets/posters/schema_original-5.png';
    import schema_original_6 from '$lib/assets/posters/schema_original-6.png';
    import schema_original_7 from '$lib/assets/posters/schema_original-7.png';
    import schema_original_8 from '$lib/assets/posters/schema_original-8.png';
    import schema_original_9 from '$lib/assets/posters/schema_original-9.png';
    import schema_original_10 from '$lib/assets/posters/schema_original-10.png';
    import schema_original_11 from '$lib/assets/posters/schema_original-11.png';
    import schema_original_12 from '$lib/assets/posters/schema_original-12.png';
    import schema_original_13 from '$lib/assets/posters/schema_original-13.png';
    import schema_original_14 from '$lib/assets/posters/schema_original-14.png';
    import schema_original_15 from '$lib/assets/posters/schema_original-15.png';
    import schema_original_16 from '$lib/assets/posters/schema_original-16.png';
    import schema_original_17 from '$lib/assets/posters/schema_original-17.png';
    import schema_original_18 from '$lib/assets/posters/schema_original-18.png';

    const posters = [
        schema_original,
        schema_original_1,
        schema_original_2,
        schema_original_3,
        schema_original_4,
        schema_original_5,
        schema_original_6,
        schema_original_7,
        schema_original_8,
        schema_original_9,
        schema_original_10,
        schema_original_11,
        schema_original_12,
        schema_original_13,
        schema_original_14,
        schema_original_15,
        schema_original_16,
        schema_original_17,
        schema_original_18,
        schema_original,
        schema_original_1,
        schema_original_2,
        schema_original_3,
        schema_original_4,
        schema_original_5,
        schema_original_6,
        schema_original_7,
        schema_original_8,
        schema_original_9,
        schema_original_10,
        schema_original_11,
        schema_original_12,
        schema_original_13,
        schema_original_14,
        schema_original_15,
        schema_original_16,
        schema_original_17,
        schema_original_18
    ];

	import {  T } from '@threlte/core'
	import { useTexture } from '@threlte/extras'
    import { onMount, onDestroy } from 'svelte'
    import { interactivity, useCursor } from '@threlte/extras'
    
    import type { Mesh as ThreeMesh } from 'three'
    
import { browser } from '$app/environment'; 
	import { GodRaysCombineShader } from 'three/examples/jsm/Addons.js';

    // Removed LocomotiveScroll; we drive scroll from wheel/touch directly
	let scrollY = $state(0);
    let scrollFactor = (0.01);
	// User-controlled deformation multiplier (1 = default strength)
	let deformationStrength = $state(2);
    let cursorTag: HTMLElement;

	$effect(() => {
		if ((props as any)?.deformationStrength !== undefined) {
			deformationStrength = (props as any).deformationStrength as number;
		}
	});

	// Use Threlte's cursor handlers (must be created during init, not in event callbacks)
	const { onPointerEnter, onPointerLeave } = useCursor();

    let spacing = (7);
    const startZ = 5;
    const groupTotalLength = posters.length * spacing;
    const middleZ = startZ + Math.floor(posters.length / 2) * spacing;

    let meshes: ThreeMesh[] = [];
    // Per-card hover scale offsets and targets (smoothly animated)
    let hoverToScale = $state<number[]>(Array(posters.length).fill(0));
    let targetScaleByIndex = $state<number[]>(Array(posters.length).fill(0));
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
                hoverToScale[i] = current + delta * 0.2;
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
		const windStrength = Math.max(-1, Math.min(1, scrollDelta * 0.01));

		for (const mesh of meshes) {
			const position = mesh?.geometry?.attributes?.position;
			if (!position) continue;

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
			const threshold = 0.35; // 0..1

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
				s = s * s; // emphasize rounding
				const maxCurl = 0.45; // softer amplitude
				zOffset = s * maxCurl * windStrength * Math.max(0, deformationStrength);
				// Smoothly vary curl direction across X (gentler near center)
				const nxEdge = x / Math.max(1e-6, halfW); // -1 .. 1
				const sign = nxEdge >= 0 ? -1 : 1; // right negative, left positive
				const a = Math.min(1, Math.abs(nxEdge));
				const eased = a * a * (3 - 2 * a); // smoothstep
				const dir = sign * eased;
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

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY;
            const prev = scrollY;
            scrollY = prev + delta * scrollFactor;
            deformMeshes(delta);
        };

        let touchY = 0;
        const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0; };
        const onTouchMove = (e: TouchEvent) => {
            const yNow = e.touches[0]?.clientY ?? 0;
            const dy = touchY - yNow;
            const prev = scrollY;
            scrollY = prev + dy * scrollFactor;
            deformMeshes(dy);
            touchY = yNow;
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });

        onDestroy(() => {
            window.removeEventListener('wheel', onWheel as any);
            window.removeEventListener('touchstart', onTouchStart as any);
            window.removeEventListener('touchmove', onTouchMove as any);
        });
    });

    // cursor move handler is removed in onMount cleanup above
</script>


<T.Group
rotation={[0.3, -0.5, 0]}
>
    {#each posters as poster, index}
        {@const texture = useTexture(poster).then(texture => texture)}
            {#await texture then map}
                    <T.Mesh
                        position={[0, 0, cardBoundTeleport(startZ + (index * spacing) + scrollY)]}
                        scale={[1 + hoverToScale[index], 1 + hoverToScale[index], 1]}
                        rotation={[0, 0, 0]}
                        oncreate={(value) => {
                            if (value && !meshes.includes(value)) meshes.push(value);
                        }}
                        onpointerenter={(e: any) => {
                                e.stopPropagation();
                                setHoverTarget(index, 0.2);
                                onPointerEnter();
                            }}
                            onpointerleave={(e: any) => {
                                e.stopPropagation();
                                setHoverTarget(index, 0);
                                onPointerLeave();
                            }}  
                        interactive={true}
                        castShadow={true}
                        receiveShadow={true}
                        >
                            <T.BoxGeometry args={[12, 12*1.3, 0.1, 24, 32, 2]} />
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
    near={0.01}
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