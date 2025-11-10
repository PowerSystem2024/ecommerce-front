import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 2000 // Aumenta el límite a 2000 kB
  }
}))
