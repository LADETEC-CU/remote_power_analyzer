import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { resolve } from 'path';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true
        })
    ],

    kit: {
        adapter: adapter(),
		paths: {
			base: dev ? '' : '/demo'
		},
        alias: {
            $components: resolve('./src/components/')
        }
    }
};

export default config;
