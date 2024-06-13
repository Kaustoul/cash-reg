import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

    css: {
        preprocessorOptions: {
            sass: {
                additionalData: `
                @use '$lib/styles/vars' as vars;
                @use '$lib/styles/buttons' as btns;
                @use '$lib/styles/text-styles' as ts;
                `,
            }
        },
    }
});
