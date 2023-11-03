import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            include: "**/*.svg?react",
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/__tests__/setup.js',
    },
    css: {
        preprocessorOptions: {
            less: {
                math: "always",
                relativeUrls: true,
                javascriptEnabled: true
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    }
})
