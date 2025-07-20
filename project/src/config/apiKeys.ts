// API Keys Configuration
// Add your API keys here or use environment variables

export const API_KEYS = {
  // Grok API Configuration
  GROK_API_KEY: process.env.REACT_APP_GROK_API_KEY || 'GROK_API_KEY',
  GROK_API_URL: process.env.REACT_APP_GROK_API_URL || 'https://api.groq.com/openai/v1',
  
  // AssemblyAI Configuration
  ASSEMBLY_AI_API_KEY: process.env.REACT_APP_ASSEMBLY_AI_API_KEY || 'ASSEMBLY_AI_API_KEY',
  ASSEMBLY_AI_API_URL: process.env.REACT_APP_ASSEMBLY_AI_API_URL || 'https://api.assemblyai.com/v2',
  
  // Other API configurations
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  GOOGLE_TRANSLATE_API_KEY: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || '',
  
  // Gemini API Configuration
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || 'GEMINI_API_KEY',
};

// Validation function to check if required API keys are present
export const validateApiKeys = () => {
  const missingKeys: string[] = [];
  
  if (!API_KEYS.GROK_API_KEY) {
    missingKeys.push('GROK_API_KEY');
  }
  
  if (!API_KEYS.ASSEMBLY_AI_API_KEY) {
    missingKeys.push('ASSEMBLY_AI_API_KEY');
  }
  
  if (!API_KEYS.GEMINI_API_KEY) {
    console.warn('Gemini API key not configured - translation features may be limited');
  }
  
  if (missingKeys.length > 0) {
    console.warn('Missing API keys:', missingKeys);
    return false;
  }
  
  return true;
};

// Helper function to get API key safely
export const getApiKey = (keyName: keyof typeof API_KEYS): string => {
  const key = API_KEYS[keyName];
  if (!key) {
    throw new Error(`API key ${keyName} is not configured`);
  }
  return key;
};