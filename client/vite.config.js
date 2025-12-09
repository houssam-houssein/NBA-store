import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the base path from environment variable or default to '/NBA-store/'
// If your repo is at username.github.io/repo-name, set base to '/repo-name/'
// If your repo is at username.github.io (root), set base to '/'
// For NBA-store repository, default to '/NBA-store/' if not set
const base = process.env.VITE_BASE_PATH || '/NBA-store/'

export default defineConfig({
  base: base,
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.png')) {
            return 'assets/images/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    }
  }
})

