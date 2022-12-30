import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

console.log('------------\n\n\n\n' + process.env.NODE_ENV + '\n\n---------------------------');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs'
		}),
		paths: {
			base: process.env.NODE_ENV === 'development' ? '' : '/sveltekit-typescript'
		},
		appDir: 'internal' // For github pages: https://www.npmjs.com/package/@sveltejs/adapter-static/v/next
	}
};

export default config;
