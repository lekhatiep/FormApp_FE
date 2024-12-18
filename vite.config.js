import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@components': resolve('./src/components'),
        '@constants': resolve('./src/constants'),
        '@pages': resolve('./src/pages'),
        '@contexts': resolve('./src/contexts'),
        '@utils': resolve('./src/utils'),
      },
    },
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true
    }
  }
})
