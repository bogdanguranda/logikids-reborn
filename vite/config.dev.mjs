import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    define: {
        __ASSETS_BASE_PATH__: JSON.stringify('assets/')
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    }
});
