# CareMate - Chronic Care Management Platform

A comprehensive healthcare platform for managing chronic conditions with AI-powered health assistance in all Indian languages.

## Features

- **Multi-language AI Health Assistant**: Supports all major Indian languages including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, and Sinhala
- **Vitals Tracking**: Monitor blood pressure, glucose levels, pulse rate, and symptoms
- **Appointment Management**: Schedule and manage healthcare appointments
- **Secure Messaging**: HIPAA-compliant communication between patients and providers
- **Care Plans**: Personalized treatment and monitoring plans
- **Voice Input**: Speech-to-text support for Indian languages
- **Text-to-Speech**: Audio responses in Indian languages

## API Configuration

### Required API Keys

1. **Grok API (X.AI)**: For AI health assistance
2. **AssemblyAI**: For voice transcription

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to the `.env` file:
   ```env
   REACT_APP_GROK_API_KEY=your_grok_api_key_here
   REACT_APP_ASSEMBLY_AI_API_KEY=your_assembly_ai_api_key_here
   ```

3. Get your API keys:
   - **Grok API**: Visit [X.AI](https://x.ai) to get your API key
   - **AssemblyAI**: Visit [AssemblyAI](https://www.assemblyai.com) to get your API key

### API Key Configuration

API keys are managed in `src/config/apiKeys.ts`. The system will:
- Load keys from environment variables
- Validate that required keys are present
- Provide helper functions for safe key access

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your API keys (see API Configuration above)
4. Start the development server:
   ```bash
   npm run dev
   ```

## AI Health Assistant Features

- **Multi-language Support**: Automatically detects and responds in the user's language
- **Voice Input**: Speak in any supported Indian language
- **Health Guidance**: Provides medical information and recommendations
- **Emergency Detection**: Recognizes urgent health concerns
- **Cultural Sensitivity**: Understands Indian healthcare context

## Supported Languages

- हिंदी (Hindi)
- English (Indian)
- বাংলা (Bengali)
- తెలుగు (Telugu)
- मराठी (Marathi)
- தமிழ் (Tamil)
- ગુજરાતી (Gujarati)
- ಕನ್ನಡ (Kannada)
- മലയാളം (Malayalam)
- ਪੰਜਾਬੀ (Punjabi)
- ଓଡ଼ିଆ (Odia)
- অসমীয়া (Assamese)
- اردو (Urdu)
- संस्कृत (Sanskrit)
- नेपाली (Nepali)
- සිංහල (Sinhala)

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Integration**: Grok API (X.AI)
- **Voice Processing**: AssemblyAI
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **Icons**: Lucide React

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.