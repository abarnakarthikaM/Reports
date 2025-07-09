
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '1265145e-6581-49c1-b373-4d9bd1c508e7-00-1j8ecgvmgmodn.pike.replit.dev'
    ]
  },
})
