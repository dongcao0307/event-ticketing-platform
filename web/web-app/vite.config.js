import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api/auth': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/events': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/admin': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/organizer': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/bookings': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
      },
      '/api/tickets': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
      },
      '/api/ticket_types': {
        target: 'https://localhost:8443',
        secure: false,
        changeOrigin: true,
      },
      '/api/payment': {
        target: 'https://localhost:8443',
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
})
