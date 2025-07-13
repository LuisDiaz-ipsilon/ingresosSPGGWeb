import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //base: mode === 'production' ? '/pagos/' : '/',
  server: {
    fs: { strict: false },
    hmr: { protocol: 'ws' },
  },
  plugins: [react()],
})
