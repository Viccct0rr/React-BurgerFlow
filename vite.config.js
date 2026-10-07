import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/React-BurgerFlow/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [{
        name: 'github-pages-spa-fallback',
        generateBundle(_, bundle) {
          const index = bundle['index.html']
          if (index?.type === 'asset') {
            this.emitFile({ type: 'asset', fileName: '404.html', source: index.source })
          }
        },
      }],
    },
  },
})
