import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

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
    String(env.VITE_BACKEND_URL ?? '')
      .trim()
      .replace(/\/+$/, '')
  )

  return {
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
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
        '/generated': { target: proxyTarget, changeOrigin: true },
        '/pixora-runtime.js': { target: proxyTarget, changeOrigin: true },
      },
    },
  }
})
