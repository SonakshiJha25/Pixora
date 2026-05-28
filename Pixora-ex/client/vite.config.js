import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_BACKEND_ORIGIN = 'https://pixora-backend-p5vv.onrender.com'

function escapeHtmlAttr(value) {
  return String(value)
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET?.trim() || 'http://localhost:4000'
  const backendOrigin = escapeHtmlAttr(
    String(env.VITE_BACKEND_URL ?? (mode === 'production' ? DEFAULT_BACKEND_ORIGIN : ''))
      .trim()
      .replace(/\/+$/, '')
  )

  return {
    resolve: {
      alias: {
        '@photos': path.join(repoRoot, 'photos'),
      },
    },
    plugins: [
      react(),
      {
        name: 'pixora-inject-backend-meta',
        transformIndexHtml(html) {
          if (!html.includes('pixora-api-base')) return html
          return html.replace(
            /<meta\s+name=["']pixora-api-base["']\s+content=["'][^"']*["']\s*\/?>/i,
            `<meta name="pixora-api-base" content="${backendOrigin}" />`
          )
        },
      },
    ],
    server: {
      fs: {
        allow: [repoRoot],
      },
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
        '/generated': { target: proxyTarget, changeOrigin: true },
        '/pixora-runtime.js': { target: proxyTarget, changeOrigin: true },
      },
    },
  }
})
