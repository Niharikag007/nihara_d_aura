import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split chunks for better caching (Vite 8 / Rolldown requires a function)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/recharts')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/zustand') || id.includes('node_modules/socket.io-client') || id.includes('node_modules/engine.io')) {
            return 'vendor-state';
          }
        },
      },
    },
    // Smaller chunk size warning threshold
    chunkSizeWarningLimit: 500,
    // Disable source maps for smaller bundles
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'socket.io-client'],
  },
})
