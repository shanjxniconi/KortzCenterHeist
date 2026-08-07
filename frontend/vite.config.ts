import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths()],
    resolve: {
        alias: {
            app: path.resolve(__dirname, './app'),
            types: path.resolve(__dirname, './app/types'),
            styles: path.resolve(__dirname, './app/styles'),
            components: path.resolve(__dirname, './app/components'),
        },
    },
    server: {
        hmr: {
            overlay: false,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    }
});