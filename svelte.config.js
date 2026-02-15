import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		preserveComments: false,
		preserveWhitespace: false
	},
	kit: {
		adapter: adapter({
			precompress: true,
			polyfill: false
		}),
		alias: {
			$api: './src/api',
			$components: './src/components',
			$routeparams: './src/types/routeparams',
			$routes: './src/routes',
			$types: './src/types'
		}
	}
};

export default config;
