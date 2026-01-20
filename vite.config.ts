import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: false,
		minify: true,
		cssMinify: true,
		emptyOutDir: true,
		chunkSizeWarningLimit: 4096,
		rollupOptions: {
			treeshake: true,
			output: {
				compact: true
			}
		}
	},
	clearScreen: true
});
