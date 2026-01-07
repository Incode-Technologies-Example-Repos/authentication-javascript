// vite.config.js
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    https: true,
    proxy: 
    {
      "/backend": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, ""),
      },
      '/api': {
        target: 'https://demo-api.incodesmile.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  plugins: [mkcert(), react()]
})
