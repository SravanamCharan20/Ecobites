import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    server: {
      host: '0.0.0.0',
      ...(isDevelopment && {
        proxy: {
          '/api': {
            target: 'http://localhost:6001',
            secure: false,
            changeOrigin: true,
          },
        },
      }),
    },
    build: {
      outDir: 'dist',
    },
    plugins: [react()],
  };
});