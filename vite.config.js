import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  esbuild: {
    // Ship a leaner production bundle — no console/debugger statements.
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split the heavy framework/vendor code out of the entry chunk so the
        // first paint only downloads what it needs and vendors stay cached.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
      // Serve the crawler sitemap at the canonical root path.
      '/sitemap.xml': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}))
