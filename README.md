# 🩺 CareMate – AI-Powered Chronic Disease Monitoring & Remote Care Platform

CareMate bridges the gap between patients and healthcare professionals through intelligent chronic disease monitoring, multilingual AI assistance, and innovative gamification. Built for the diverse healthcare landscape of India, it combines traditional medical care with cutting-edge technology to make healthcare accessible, engaging, and effective.

## 🌍 Live Deployment & Demo

| Resource       | Link                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Live App**   | [https://caremate0507.netlify.app/](https://caremate0507.netlify.app/) |
| **Demo Video** | [Watch the walkthrough on YouTube](https://youtu.be/VyZv46rnjzA)                            |
| **Repository** | [GitHub Repository](https://github.com/Shine-5705/CareMate-AI-Powered-Chronic-Disease-Monitoring-Remote-Care) |

---

## 🚀 Core Features

### 👩‍⚕️ Patient Experience

#### **Vitals & Health Monitoring**
- **Daily vitals submission** – Blood pressure, glucose levels, pulse rate, symptoms
- **Visual health analytics** – Interactive line & bar charts for long-term trends  
- **AI-powered feedback** – Real-time, multilingual guidance on abnormal patterns
- **Downloadable reports** – Shareable PDF health summaries for medical records

#### **AI Health Assistant**
- **Multi-language Support**: Supports all major Indian languages including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, and Sinhala
- **Voice Input & Output**: Speech-to-text and text-to-speech in Indian languages
- **Cultural Sensitivity**: Understands Indian healthcare context and provides culturally appropriate guidance
- **Emergency Detection**: Recognizes urgent health concerns and provides immediate guidance

#### **Advanced Health Analysis**
- **AI Skin Analysis**: Computer vision-powered skin condition detection with treatment recommendations and home remedies
- **Cough Detection & Respiratory Analysis**: 30-second audio recording with AI-powered cough pattern recognition and respiratory health assessment
- **Severity Assessment**: Classification of health conditions (mild, moderate, severe) with appropriate care recommendations

### 🎮 EcoFit AR Adventure - Gamified Fitness

Transform your workout routine into an immersive environmental conservation mission:

#### **AR Fitness Gaming**
- **Exercise-to-Action Mapping**: Real-world movements control in-game rescue missions
  - **Squats** = Lift debris to free trapped animals
  - **Jumping jacks** = Charge rescue beacons to guide lost animals  
  - **Push-ups** = Build shelters for rescued creatures
  - **Running** = Track animal signals through wilderness
  - **Yoga** = Heal injured animals with calming energy
  - **Planks** = Create bridges for safe animal passage

#### **Personalized Fitness Experience**
- **AI-Generated Tasks**: Custom fitness challenges based on age, weight, height, BMI, and health conditions
- **Video Recording & Analysis**: 60-second video capture with AI-powered form verification and feedback
- **Adaptive Gameplay**: Dynamic difficulty adjustment based on fitness level and exercise preferences
- **Progress Tracking**: Point-based system (10-30 points per task) with achievements and performance analytics

#### **Environmental Impact Gaming**
- **Conservation Missions**: Transform workouts into meaningful virtual environmental restoration
- **Species Unlocking**: Discover new animals and habitats through consistent exercise
- **Impact Visualization**: Track animals saved and habitats restored through your fitness journey
- **Achievement System**: Milestone tracking and environmental impact metrics

### 🩺 Healthcare Professional Dashboard

- **Unified patient monitoring** – Track multiple patients at a glance
- **Critical health alerts** – Immediate notification of dangerous vital deviations  
- **Historical insights** – Comprehensive charts & symptom timelines
- **Appointment management** – Create, reschedule, or cancel patient visits
- **Provider notes & care plans** – Add personalized treatment instructions
- **Scalable infrastructure** – Support for clinics, hospitals, & multi-doctor teams

### 💬 Communication & Care Coordination

- **Secure Messaging**: HIPAA-compliant communication between patients and providers
- **Appointment Scheduling**: Calendar-view bookings with automated reminders
- **Care Plans**: Personalized treatment and monitoring protocols
- **Medication Alerts**: Push/email/SMS notifications for medication adherence
- **Multi-channel Notifications**: Comprehensive reminder system for check-ins and appointments

---

## 🌐 Supported Languages

CareMate provides full multilingual support with automatic language detection:

| Language | Script | Language | Script |
|----------|--------|----------|--------|
| हिंदी | Hindi | English | Indian English |
| বাংলা | Bengali | తెలుగు | Telugu |
| मराठी | Marathi | தமிழ் | Tamil |
| ગુજરાતી | Gujarati | ಕನ್ನಡ | Kannada |
| മലയാളം | Malayalam | ਪੰਜਾਬੀ | Punjabi |
| ଓଡ଼ିଆ | Odia | অসমীয়া | Assamese |
| اردو | Urdu | संस्कृत | Sanskrit |
| नेपाली | Nepali | සිංහල | Sinhala |

---

## ⚙️ Technology Stack

| Layer                | Technologies                           |
| -------------------- | -------------------------------------- |
| **Frontend**         | React, Vite, TypeScript               |
| **Styling**          | Tailwind CSS, Heroicons, Lucide React |
| **Charts & Data Viz**| Recharts                              |
| **Calendar**         | FullCalendar                          |
| **Backend**          | Flask (REST API), SQLite/PostgreSQL   |
| **AI & ML**          | Groq API (X.AI), OpenAI (fallback)   |
| **Computer Vision**  | OpenCV.js, TensorFlow.js              |
| **Audio Processing** | Web Audio API, AssemblyAI             |
| **Voice Processing** | Browser Speech API, AssemblyAI        |
| **Authentication**   | JWT (planned)                         |
| **Deployment**       | Netlify (frontend), Vercel/Render ready |

---

## 🔑 API Configuration

### Required API Keys

CareMate requires two external services for full functionality:

1. **Groq API (X.AI)** – For conversational health AI
2. **AssemblyAI** – For speech transcription and audio analysis

### Setup Instructions

1. **Clone the environment configuration:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to the `.env` file:**
   ```env
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   REACT_APP_ASSEMBLYAI_API_KEY=your_assemblyai_key_here
   ```

3. **Obtain your API keys:**
   - **Groq API**: Visit [console.groq.com](https://console.groq.com) to get your API key
   - **AssemblyAI**: Visit [assemblyai.com](https://www.assemblyai.com) to get your API key

### Backend Configuration

For the backend service, create `backend/.env`:
```env
ASSEMBLYAI_API_KEY=your_assemblyai_key_here
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- **Python** ≥ 3.10 (for backend services)

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/Shine-5705/CareMate-AI-Powered-Chronic-Disease-Monitoring-Remote-Care.git
cd CareMate

# Install dependencies
npm install

# Configure API keys (see API Configuration above)
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure backend environment
# Create backend/.env with your API keys

# Start backend server
python start.py   # or python app.py
```

### Running Both Services

```bash
# Terminal 1 – Backend
cd backend && python start.py

# Terminal 2 – Frontend  
npm run dev
```

**Access Points:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

### Verification

Visit `/api/health` to confirm backend status:
```
🚀 Starting CareMate Backend Server…
📍 Server: http://localhost:5000
🔑 AssemblyAI API Key: ✅ Set
🔑 Groq API Key: ✅ Set
```

---

## 📱 Application Features Deep Dive

### Health Monitoring & Analytics
- **Real-time vitals tracking** with intelligent pattern recognition
- **Predictive health insights** using machine learning algorithms  
- **Comprehensive health reports** with trend analysis and recommendations
- **Multi-parameter monitoring** for various chronic conditions

### AI-Powered Health Assistant
- **Contextual health conversations** with medical knowledge base
- **Symptom assessment** and triage recommendations
- **Medication reminders** and adherence tracking
- **Emergency response protocols** with immediate care guidance

### Gamified Fitness & Wellness
- **Personalized exercise prescriptions** based on health conditions
- **AR-enhanced workout experiences** with environmental themes
- **Social fitness challenges** and community engagement
- **Progress gamification** with rewards and achievement systems

### Clinical Integration
- **Provider dashboard** for patient monitoring and care coordination
- **Clinical decision support** with AI-generated insights
- **Appointment scheduling** with automated workflow management
- **Secure communication** channels between patients and providers

---

## 🐛 Troubleshooting

| Issue | Resolution |
|-------|------------|
| **Missing API Keys** | Ensure both `.env` and `backend/.env` contain valid API keys |
| **Module Not Found** | Run `pip install -r requirements.txt` in backend directory |
| **Connection Refused** | Verify backend is running on port 5000 |
| **CORS Errors** | Ensure both frontend and backend are running locally |
| **Audio/Voice Issues** | Check microphone permissions and browser compatibility |
| **Camera Access Denied** | Grant camera permissions for skin analysis features |

---

## 🗺️ Roadmap

### Phase 1: Core Enhancements
- [ ] **Enhanced Voice Assistant** – End-to-end voice interactions
- [ ] **Wearable Integrations** – Fitbit, Apple Watch, Samsung Health
- [ ] **Advanced ML Models** – Improved anomaly detection and predictions
- [ ] **Telemedicine Integration** – Video consultations and remote monitoring

### Phase 2: Platform Expansion  
- [ ] **EHR Interoperability** – HL7/FHIR standard compliance
- [ ] **Multi-tenant Architecture** – Hospital and clinic management systems
- [ ] **Advanced RBAC** – Role-based access control with MFA
- [ ] **Blockchain Integration** – Secure health record management

### Phase 3: Advanced Features
- [ ] **Predictive Analytics Dashboard** – Population health insights
- [ ] **IoT Device Integration** – Smart home health monitoring
- [ ] **Clinical Trial Management** – Research participation and data collection
- [ ] **Global Expansion** – International language and regulatory support

---

## 🤝 Contributing

We welcome contributions from the healthcare technology community!

### Getting Started
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with detailed description

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features when applicable
- Update documentation for API changes
- Ensure all existing tests pass
- Include screenshots for UI changes

### Bug Reports & Feature Requests
Use our [Issues](../../issues) page to report bugs or suggest new features.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Acknowledgments

### Primary Author
**Shine Gupta**  
📧 [guptashine5002@gmail.com](mailto:guptashine5002@gmail.com)  
🔗 [GitHub Profile](https://github.com/Shine-5705)

---

## 📞 Support & Contact

- **Technical Support**: [guptashine5002@gmail.com](mailto:guptashine5002@gmail.com)
---

<p align="center">
  <strong>Made with ❤️ for accessible healthcare technology</strong><br>
  <em>Empowering patients and healthcare providers through intelligent technology</em>
</p>
