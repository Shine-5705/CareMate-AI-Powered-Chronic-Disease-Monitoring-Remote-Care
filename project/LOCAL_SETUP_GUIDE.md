# CareMate - Local Development Setup Guide

A comprehensive guide to set up and run the CareMate AI-powered chronic care management platform locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **pip** (Python package manager) - Comes with Python
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Python version
python --version
# or
python3 --version

# Check pip version
pip --version
# or
pip3 --version

# Check Git version
git --version
```

## 🔑 API Keys Required

You'll need to obtain the following API keys:

### 1. Groq API Key (for AI Health Assistant)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### 2. AssemblyAI API Key (for Voice Transcription)
1. Visit [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for a free account
3. Go to your dashboard
4. Copy your API key

### 3. Google Gemini API Key (for Skin Analysis)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key

## 📁 Project Setup

### 1. Clone the Repository
```bash
# Clone the project
git clone <your-repository-url>
cd caremate

# Or if you're starting from the current directory
# Just ensure you're in the project root
```

### 2. Frontend Setup

#### Install Dependencies
```bash
# Install all frontend dependencies
npm install
```

#### Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your API keys
nano .env
# or use your preferred editor: code .env, vim .env, etc.
```

Add your API keys to the `.env` file:
```env
# Groq API (for AI Health Assistant)
REACT_APP_GROK_API_KEY=your_groq_api_key_here
REACT_APP_GROK_API_URL=https://api.groq.com/openai/v1

# AssemblyAI (for Voice Transcription)
REACT_APP_ASSEMBLY_AI_API_KEY=your_assemblyai_api_key_here
REACT_APP_ASSEMBLY_AI_API_URL=https://api.assemblyai.com/v2

# Google Gemini (for Skin Analysis)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

#### Install Python Dependencies
```bash
# Install all required packages
pip install -r requirements.txt
```

#### Configure Backend Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the backend .env file
nano .env
```

Add your API keys to the `backend/.env` file:
```env
# Backend API Keys
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Running the Application

### Method 1: Run Both Frontend and Backend Separately

#### Terminal 1 - Start the Backend Server
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start the Flask server
python app.py
```

You should see:
```
🚀 Starting CareMate Backend Server...
📍 Server will run on: http://localhost:5000
✅ All required packages are installed
🔑 AssemblyAI API Key: ✅ Set
🔑 Groq API Key: ✅ Set
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://[your-ip]:5000
```

#### Terminal 2 - Start the Frontend Development Server
```bash
# Navigate to project root (open new terminal)
cd /path/to/caremate

# Start the Vite development server
npm run dev
```

You should see:
```
  VITE v5.4.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.xxx:5173/
  ➜  press h + enter to show help
```

### Method 2: Using the Backend Startup Script

#### Start Backend with Setup Validation
```bash
cd backend
python start.py
```

This script will:
- Check if all required packages are installed
- Validate API key configuration
- Start the Flask server with proper error handling

## 🌐 Accessing the Application

### Frontend Application
- **URL:** http://localhost:5173/
- **Features:** Full UI, AI chat, skin analysis, cough detection, fitness game

### Backend API
- **URL:** http://localhost:5000/
- **Health Check:** http://localhost:5000/api/health
- **Endpoints:** `/api/health-chat`, `/api/transcribe`, `/api/analyze-skin`

## 🧪 Testing the Features

### 1. Test AI Health Assistant
1. Open http://localhost:5173/
2. Click the Bot icon in the bottom right
3. Select a language (Hindi, English, etc.)
4. Type a health question or use voice input
5. Verify AI responses in the selected language

### 2. Test Skin Analysis
1. Click the Camera icon in the header
2. Upload an image or use camera capture
3. Select your preferred language
4. Click "Analyze Image"
5. Review the detailed analysis results

### 3. Test Cough Analysis
1. Click the 🫁 icon in the header
2. Record a 30-second audio sample
3. Click "Analyze for Cough & Respiratory Issues"
4. Review the respiratory health assessment

### 4. Test Fitness Game
1. Click the 🌍 icon in the header
2. Set up your profile
3. Select exercises (rescue powers)
4. Record exercise videos
5. See gamified results with animal rescue themes

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Frontend Issues

**Issue: `npm install` fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

**Issue: Environment variables not loading**
```bash
# Ensure .env file is in the project root
ls -la .env

# Restart the development server
npm run dev
```

**Issue: API calls failing**
- Check that backend server is running on port 5000
- Verify API keys are correctly set in both `.env` files
- Check browser console for CORS errors

#### Backend Issues

**Issue: Python packages not installing**
```bash
# Upgrade pip
pip install --upgrade pip

# Install packages one by one to identify issues
pip install flask
pip install flask-cors
pip install requests
pip install python-dotenv
```

**Issue: Virtual environment not activating**
```bash
# On Windows, try:
venv\Scripts\activate.bat

# On macOS/Linux, ensure you're in the backend directory:
cd backend
source venv/bin/activate
```

**Issue: API keys not recognized**
```bash
# Check if .env file exists in backend directory
ls -la backend/.env

# Verify file contents (without exposing keys)
head backend/.env
```

#### API Integration Issues

**Issue: Groq API errors**
- Verify your API key is valid and active
- Check rate limits on your Groq account
- Ensure you have sufficient credits

**Issue: AssemblyAI transcription fails**
- Verify API key is correct
- Check audio file format (should be webm/wav)
- Ensure microphone permissions are granted

**Issue: Gemini API errors**
- Verify API key is enabled for Gemini Pro
- Check quota limits in Google Cloud Console
- Ensure billing is set up if required

## 📱 Mobile Testing

### Test on Mobile Devices
1. Find your computer's IP address:
   ```bash
   # On macOS/Linux
   ifconfig | grep inet
   
   # On Windows
   ipconfig
   ```

2. Access the app on mobile:
   - Frontend: `http://[your-ip]:5173/`
   - Ensure both devices are on the same network

3. Test mobile-specific features:
   - Camera access for skin analysis
   - Microphone access for voice input
   - Touch interactions
   - Responsive design

## 🔒 Security Notes

### Development Environment
- API keys are loaded from environment variables
- Never commit `.env` files to version control
- Use different API keys for development and production

### Production Deployment
- Set environment variables in your hosting platform
- Use HTTPS for all API communications
- Implement proper CORS policies
- Consider rate limiting for API endpoints

## 📊 Performance Optimization

### Frontend Optimization
```bash
# Build for production to test performance
npm run build

# Preview production build
npm run preview
```

### Backend Optimization
- Monitor API response times
- Implement caching for repeated requests
- Use connection pooling for database operations
- Consider using Redis for session management

## 🛠️ Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Python
- Prettier - Code formatter
- ESLint
- Auto Rename Tag

### Browser Developer Tools
- Use Chrome DevTools for debugging
- Monitor Network tab for API calls
- Check Console for JavaScript errors
- Use Application tab to inspect local storage

## 📚 Additional Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Groq API Docs](https://console.groq.com/docs)
- [AssemblyAI Docs](https://www.assemblyai.com/docs)
- [Google AI Studio](https://makersuite.google.com/)

### Community Support
- [React Community](https://react.dev/community)
- [Tailwind Community](https://tailwindcss.com/community)
- [Python Flask Community](https://flask.palletsprojects.com/community/)

## 🎯 Next Steps

After successfully running the application locally:

1. **Explore the codebase** to understand the architecture
2. **Customize the UI** with your own branding
3. **Add new features** or modify existing ones
4. **Deploy to production** using Netlify, Vercel, or your preferred platform
5. **Set up monitoring** and analytics
6. **Implement user authentication** with a proper backend
7. **Add database integration** for persistent data storage

## 🤝 Contributing

If you want to contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter issues:

1. Check this setup guide first
2. Review the troubleshooting section
3. Check the browser console for errors
4. Verify all API keys are correctly configured
5. Ensure all dependencies are properly installed

---

**Happy coding! 🚀**

The CareMate platform showcases the power of modern web technologies combined with cutting-edge AI to create meaningful healthcare solutions. Enjoy exploring and building upon this foundation!