import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig({
    // base: '/jammming/',
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        reporters: 'verbose',
    },
    "build": {
        minify: 'esbuild',
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            }
        }
    }
});