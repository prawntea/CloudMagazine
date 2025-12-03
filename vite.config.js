import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // my ngrok tunnel hostnames
    allowedHosts: ['.localhost', 'unitedly-intercorporate-cohen.ngrok-free.dev', '.ngrok.io'],
  },
})
