import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: '/',
  },
  define: {
    'process.env': {} // Уникає помилки у браузері
  },
  plugins: [react()],
})
