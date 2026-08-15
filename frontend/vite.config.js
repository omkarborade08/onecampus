import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://onecampusapi.onrender.com',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://onecampusapi.onrender.com',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
