import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Слушаем все интерфейсы
    port: 5173,
    allowedHosts: ['team24.innoca.local'],
    strictPort: true, // Запрещаем автоматический выбор порта
    hmr: {
      clientPort: 5173, // Важно для HMR в Docker
    },
    // Разрешаем CORS для внешних запросов
    cors: true
  },

  //Path Aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@http': path.resolve(__dirname, './src/http'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@typesResp': path.resolve(__dirname, './src/types'),
      '@main': path.resolve(__dirname, './src/main'),

    },
  },
})