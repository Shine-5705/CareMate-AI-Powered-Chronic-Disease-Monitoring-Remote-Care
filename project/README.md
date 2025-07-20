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
- **Voice Input**: Speech-to-text support for Indian languages
- **Text-to-Speech**: Audio responses in Indian languages
- **AI Skin Analysis**: Computer vision-powered skin condition analysis with treatment recommendations
- **AI Skin Analysis**: Computer vision-powered skin condition analysis with treatment recommendations
- **Cough Detection**: Real-time audio analysis for cough and respiratory health assessment
- **Respiratory Analysis**: 30-second audio recording with AI-powered cough detection and health recommendations
- **Health & Fitness Game**: Gamified fitness challenges with personalized task generation, video recording, and point tracking
- **Personalized Exercise Plans**: AI-generated fitness tasks based on age, weight, height, and health conditions
- **Video Task Verification**: Record exercise videos and get AI-powered form analysis and feedback
- **Fitness Progress Tracking**: Point-based system with levels, achievements, and performance analytics
- **EcoFit AR Adventure**: Immersive AR fitness game where exercises become rescue powers to save animals and restore habitats
- **Exercise-to-Action Mapping**: Real-world movements control in-game rescue missions (squats lift debris, yoga heals animals, etc.)
- **Environmental Impact Gaming**: Transform workouts into purpose-driven missions with meaningful virtual conservation outcomes
- **Adaptive AR Gameplay**: Dynamic difficulty adjustment based on fitness level and chosen exercises for personalized experiences

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

## AI Skin Analysis Features

- **Image Capture**: Use device camera or upload existing images
- **AI-Powered Analysis**: Advanced computer vision for skin condition detection
- **Treatment Recommendations**: Personalized medication and care suggestions
- **Home Remedies**: Safe, culturally appropriate home treatments
- **Medical Guidance**: Clear indicators for when to seek professional help
- **Report Generation**: Downloadable analysis reports for medical records

## Cough Detection & Respiratory Analysis Features

- **Real-time Audio Recording**: 30-second high-quality audio capture
- **AI-Powered Cough Detection**: Machine learning algorithms for cough pattern recognition
- **Respiratory Health Assessment**: Comprehensive analysis of breathing patterns and sounds
- **Multi-language Support**: Analysis and recommendations in all supported Indian languages
- **Severity Assessment**: Classification of cough severity (mild, moderate, severe)
- **Home Remedies**: Culturally appropriate home treatments and care suggestions
- **Medical Guidance**: Clear indicators for when to seek professional respiratory care
- **Audio Playback**: Review recorded audio samples
- **Voice Recommendations**: Text-to-speech for analysis results and care instructions
- **Report Generation**: Downloadable respiratory analysis reports

## Supported Languages

## Health & Fitness Game Features

- **EcoFit AR Adventure**: Immersive augmented reality fitness experience where:
  - Choose your preferred exercises (squats, push-ups, yoga, running, etc.)
  - Each exercise maps to unique rescue powers in the AR world
  - Real-world movements directly control virtual animal rescue missions
  - Transform workouts into meaningful environmental conservation adventures
- **Exercise-to-Rescue Mapping**: 
  - Squats = Lift debris to free trapped animals
  - Jumping jacks = Charge rescue beacons to guide lost animals
  - Push-ups = Build shelters for rescued creatures
  - Running = Track animal signals through wilderness
  - Yoga = Heal injured animals with calming energy
  - Planks = Create bridges for safe animal passage
- **Personalized Task Generation**: AI creates custom fitness challenges based on:
  - Age, weight, height, and BMI calculations
  - Current fitness level and activity patterns
  - Specific health conditions and medical restrictions
  - Personal fitness goals and preferences
- **Video Recording & Analysis**: 60-second video capture with AI-powered form verification
- **AR Gamification Elements**: 
  - Point-based scoring system (10-30 points per task)
  - Animal rescue achievements and habitat restoration milestones
  - Unlock new species and environments through consistent exercise
  - Performance tracking and analytics
  - Environmental impact visualization and progress tracking
- **Exercise Categories**: 
  - Cardiovascular fitness and endurance training
  - Strength building and muscle development
  - Flexibility and mobility improvement
  - Balance and coordination exercises
  - Rehabilitation and recovery workouts
- **Adaptive AR Gameplay**:
  - Dynamic difficulty scaling based on fitness level
  - Personalized rescue missions aligned with exercise preferences
  - Real-time feedback and form correction through AR visualization
  - Progressive unlocking of more challenging conservation scenarios
- **Safety Features**:
  - Age-appropriate exercise modifications
  - Medical condition considerations
  - Proper form instructions and safety tips
  - Progressive difficulty scaling
- **Progress Analytics**: 
  - Detailed performance reports
  - Fitness improvement tracking
  - Environmental impact metrics (animals saved, habitats restored)
  - Personalized recommendations for next steps
  - Achievement history and milestone tracking

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
- **Computer Vision**: OpenCV.js
- **Machine Learning**: TensorFlow.js
- **Audio Processing**: Web Audio API
- **Speech Recognition**: Browser Speech API
- **Audio Analysis**: Custom ML algorithms for respiratory pattern detection

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