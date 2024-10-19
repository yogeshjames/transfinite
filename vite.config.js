import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@temple-wallet/dapp', '@taquito/taquito'],
  },
  server: {
    proxy: {
      '/tezos-api': {
        target: 'https://ghostnet.smartpy.io', // The actual target server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tezos-api/, ''), // Rewrite the path
        secure: false, // Disable SSL verification if necessary
      }
    }
  }
})
