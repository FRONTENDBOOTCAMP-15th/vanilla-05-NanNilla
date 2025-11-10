import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html',
        
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});