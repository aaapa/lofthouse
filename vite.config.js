import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/lofthouse/' : '/',
  plugins: [injectHTML()],
  resolve: {
    alias: [{ find: '@/', replacement: resolve('src') + '/'}],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'main.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css')
            return 'main.css';
          return '[name].[ext]';
        },
      },
      inject: {
        target: 'body'
      }
    },
    assetsDir: '',
    outDir: 'dist',
  },
  server: {
    https: {
      key: readFileSync('C:/ssl/localhost+1-key.pem'),
      cert: readFileSync('C:/ssl/localhost+1.pem'),
    },
  },
  preview: {
    https: {
      key: readFileSync('C:/ssl/localhost+1-key.pem'),
      cert: readFileSync('C:/ssl/localhost+1.pem'),
    },
    host: 'localhost',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '@/scss/helpers' as *;
        `,
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
}));
