import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //Any request will be proxied to : 
    proxy: {'/api': 'http://localhost:3000'},
  },
})
