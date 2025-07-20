import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available at build time with fallback values
    'process.env.REACT_APP_GROK_API_KEY': JSON.stringify(process.env.REACT_APP_GROK_API_KEY || 'GROQ_API_KEY'),
    'process.env.REACT_APP_ASSEMBLY_AI_API_KEY': JSON.stringify(process.env.REACT_APP_ASSEMBLY_AI_API_KEY || 'ASSEMBLY_API'),
    'process.env.REACT_APP_GROK_API_URL': JSON.stringify(process.env.REACT_APP_GROK_API_URL || 'https://api.groq.com/openai/v1'),
    'process.env.REACT_APP_ASSEMBLY_AI_API_URL': JSON.stringify(process.env.REACT_APP_ASSEMBLY_AI_API_URL || 'https://api.assemblyai.com/v2'),
    'process.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCBKfdAC-F7aIk54FNpHKcEnHh9mqZLpBI'),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
