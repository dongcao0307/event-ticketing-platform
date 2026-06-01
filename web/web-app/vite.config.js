import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const backendTarget = env.VITE_DEV_BACKEND_TARGET || 'https://localhost:8443'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      proxy: {
        '/api/auth': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/events': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/admin': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
        '/api/organizer': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/bookings': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
        '/api/tickets': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
        '/api/ticket_types': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
        '/api/payment': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
        '/api/chat': {
          target: backendTarget,
          secure: false,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './attached_assets'),
      },
    },
  }
})
