import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';
const aliasConfig = {
    '@main': resolve(__dirname, 'src/main'),
    '@renderer': resolve(__dirname, 'src/renderer/src'),
    '@shared': resolve(__dirname, 'src/shared'),
};
export default defineConfig({
    root: resolve(__dirname, 'src/renderer'),
    publicDir: resolve(__dirname, 'public'),
    plugins: [
        react(),
        electron([
            {
                entry: resolve(__dirname, 'src/main/index.ts'),
                vite: {
                    resolve: {
                        alias: aliasConfig,
                    },
                    build: {
                        outDir: resolve(__dirname, 'dist-electron'),
                    },
                },
            },
            {
                entry: resolve(__dirname, 'src/renderer/preload.ts'),
                onstart(options) {
                    options.reload();
                },
                vite: {
                    resolve: {
                        alias: aliasConfig,
                    },
                    build: {
                        outDir: resolve(__dirname, 'dist-electron'),
                    },
                },
            },
        ]),
        renderer(),
    ],
    resolve: {
        alias: aliasConfig,
    },
    base: './',
    build: {
        outDir: resolve(__dirname, 'dist-electron/renderer'),
        emptyOutDir: true,
    },
});
