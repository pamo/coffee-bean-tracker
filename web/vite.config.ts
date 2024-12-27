import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist',
    },
    server: {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      },
      proxy: !isProduction
        ? {
          '/api': {
            target: 'http://127.0.0.1:3000',
            changeOrigin: true,
            rewrite: (path) => {
              console.log(`Rewriting path: ${path}`);
              return path.replace(/^\/api/, '');
            },
            configure: (proxy, options) => {
              proxy.on('proxyReq', (proxyReq, req, res) => {
                console.log(`Proxying request to: ${proxyReq.path}`);
              });
              proxy.on('error', (err, req, res) => {
                console.error('Proxy error:', err);
              });
            },
          },
        }
        : undefined,
    },
  };
});
