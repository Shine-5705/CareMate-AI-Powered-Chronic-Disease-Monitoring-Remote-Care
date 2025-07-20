# Netlify Environment Variables Setup

## Your Deployed Site
🌐 **Live URL**: https://caremate0507.netlify.app/
🔗 **Claim URL**: https://app.netlify.com/claim?utm_source=bolt#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiI1aDZmZEstVktNTXZuRjNiRlZUaktfU2JKVGgzNlNfMjJheTlpTHhVX0Q4Iiwic2Vzc2lvbl9pZCI6IjUyNDQ4ODEwOjYxMTg0NDQiLCJpYXQiOjE3NTI1MzAzMjl9.fO6tmNox5pOQfnaAq5iUdM5i9jZqqvKglkJyBr__rLU

## Steps to Configure API Keys

### 1. Claim Your Netlify Site
1. Click the claim URL above to transfer the site to your Netlify account
2. Sign up or log in to Netlify if you haven't already

### 2. Add Environment Variables
1. Go to your Netlify dashboard
2. Select your site (dazzling-khapse-9ef20d)
3. Navigate to **Site Settings** → **Environment Variables**
4. Click **Add a variable** and add each of the following:

#### Required Environment Variables:
```
REACT_APP_GROK_API_KEY = REACT_APP_GROK_API_KEY
REACT_APP_GROK_API_URL = https://api.groq.com/openai/v1
REACT_APP_ASSEMBLY_AI_API_KEY = ASSEMBLY_AI_API_KEY
REACT_APP_ASSEMBLY_AI_API_URL = https://api.assemblyai.com/v2
```

### 3. Redeploy Your Site
After adding the environment variables:
1. Go to **Deploys** tab in your Netlify dashboard
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the deployment to complete (usually 1-2 minutes)

### 4. Test the AI Chatbot
Once redeployed:
1. Visit your live site: https://dazzling-khapse-9ef20d.netlify.app
2. Click the AI chatbot button (Bot icon) in the bottom right
3. Test voice input and text chat in multiple Indian languages
4. Verify that responses are working properly

## Features That Will Work After Setup
✅ **Multi-language AI Health Assistant** - Supports Hindi, English, Bengali, Telugu, Tamil, and 10+ other Indian languages
✅ **Voice Input** - Speak in any supported Indian language
✅ **Text-to-Speech** - Hear responses in your preferred language
✅ **Health Guidance** - Get medical information and recommendations
✅ **Emergency Detection** - Recognizes urgent health concerns

## Troubleshooting
- If the chatbot doesn't work immediately, wait 5-10 minutes for the environment variables to propagate
- Check the browser console (F12) for any API key errors
- Ensure all environment variable names are exactly as shown above (case-sensitive)
- Make sure there are no extra spaces in the API key values

## Security Note
✅ Your API keys are securely stored as environment variables in Netlify
✅ They are not exposed in the client-side code
✅ Only the frontend application can access them during build time