import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
	plugins: [
		sveltekit(),
		mkcert(),
		ViteImageOptimizer({
			jpeg: {
				quality: 90
			},
			jpg: {
				quality: 90
			},
			png: {
				quality: 90
			}
		})
	],
	server: {
		host: true
	}
});
