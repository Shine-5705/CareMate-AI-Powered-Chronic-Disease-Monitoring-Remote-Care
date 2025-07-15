import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available at build time
    'process.env.REACT_APP_GROK_API_KEY': JSON.stringify(process.env.REACT_APP_GROK_API_KEY),
    'process.env.REACT_APP_ASSEMBLY_AI_API_KEY': JSON.stringify(process.env.REACT_APP_ASSEMBLY_AI_API_KEY),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
