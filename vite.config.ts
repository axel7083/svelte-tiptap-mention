import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

function getBase(): string | undefined {
    if(!process.env.GITHUB_REPOSITORY) return;
    return process.env.GITHUB_REPOSITORY.split('/')[1];
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte({
        emitCss: true,
    })],
    base: getBase(),
})
