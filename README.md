# 🩺 CareMate – AI-Powered Chronic Disease Monitoring & Remote Care Platform

CareMate is a modern, agentic healthcare solution purpose‑built for chronic disease management, continuous vitals monitoring, and seamless patient–provider collaboration. By unifying intelligent vitals tracking, multilingual conversational AI, and personalized care plans in a single secure platform, CareMate bridges the gap between patients and healthcare professionals—anytime, anywhere.

---

## 🌍 Live Deployment & Demo

| Resource       | Link                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Live App**   | [https://caremate-youragenticdoctor.netlify.app/](https://caremate-youragenticdoctor.netlify.app/) |
| **Demo Video** | [Watch the walkthrough on YouTube](https://youtu.be/YOUR_DEMO_VIDEO_ID)                            |

<p align="center">
  <img src="docs/screenshot.png" alt="CareMate UI Screenshot" width="700"/>
</p>

> *Add your own high‑resolution screenshot in `docs/screenshot.png` or update the path above.*

---

## 🚀 Core Features

### 👩‍⚕️ Patient Experience

* **Daily vitals submission** – Blood pressure, glucose, pulse, symptoms
* **Visual health analytics** – Interactive line & bar charts for long‑term trends
* **AI feedback** – Real‑time, multilingual guidance on abnormal patterns
* **Secure chat** – HIPAA‑compliant messaging with assigned doctors
* **Appointment scheduling** – Calendar‑view bookings & reminders
* **Medication & check‑in alerts** – Push/email/SMS nudges
* **Downloadable reports** – Shareable PDF health summaries
* **Fully responsive** – Mobile‑first design for effortless access

### 🩺 Doctor Experience

* **Unified dashboard** – Monitor multiple patients at a glance
* **Critical alerts** – Immediate notification of dangerous deviations
* **Historical insights** – Drill‑down charts & symptom timelines
* **Appointment management** – Create, reschedule, or cancel visits
* **Provider notes** – Add care instructions & action plans
* **Scalable panels** – Support clinics, hospitals, & multi‑doctor teams

### 🌐 Multilingual AI Health Assistant

Supports all major Indian languages & English—Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, Sinhala—and can **auto‑detect** user language during text or voice input.

* **Voice input** – Speech‑to‑text via AssemblyAI
* **Text‑to‑speech** – Spoken replies for accessibility
* **Cultural context** – Guidance tailored to Indian healthcare norms

---

## 🖥️ Live UI Overview

A calm, accessible interface inspired by Apple Health, WhatsApp, and Google Calendar.

**Pages & Modules**

* Landing (Sign‑Up / Login)
* Role‑based Dashboards (Patient / Doctor)
* Vitals Submission
* AI Chat Interface
* Appointments Calendar
* Notifications & Reminders
* Health Analytics
* Profile & Settings

---

## ⚙️ Technology Stack

| Layer                | Tech                                  |
| -------------------- | ------------------------------------- |
| **Frontend**         | React + Vite, TypeScript              |
| **Styling**          | Tailwind CSS, Heroicons, Lucide‑React |
| **Charts**           | Recharts                              |
| **Calendar**         | FullCalendar                          |
| **Realtime Chat**    | WebSockets                            |
| **Backend**          | Flask (REST API), SQLite / PostgreSQL |
| **AI Module**        | Groq API (LLM) + OpenAI (fallback)    |
| **Voice Processing** | AssemblyAI (speech‑to‑text)           |
| **Auth**             | JWT (planned)                         |
| **Deployment**       | Netlify (live), Vercel / Render ready |

---

## 🔑 API Configuration

CareMate requires two external services:

1. **Groq API (X.AI)** – Conversational health AI
2. **AssemblyAI** – Speech transcription

```bash
# Clone example env & add keys
cp .env.example .env
```

`.env` keys

```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
REACT_APP_ASSEMBLYAI_API_KEY=your_assemblyai_key_here
```

> **Need keys?**
> • Groq: [https://console.groq.com](https://console.groq.com)
> • AssemblyAI: [https://www.assemblyai.com](https://www.assemblyai.com)

---

## 🛠️ Getting Started

### Prerequisites

* **Node.js** ≥ 18
* **npm**
* **Python** ≥ 3.10 (for backend)

### Frontend

```bash
# Install & run
npm install
npm run dev
```

### Backend

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Set API keys in backend/.env
ASSEMBLYAI_API_KEY=...
GROQ_API_KEY=...

# Start server
python start.py   # or python app.py
```

Backend will launch at **[http://localhost:5000](http://localhost:5000)**.

### Run Both Concurrently

```bash
# Terminal 1 – Backend
cd backend && python start.py

# Terminal 2 – Frontend
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend : [http://localhost:5000](http://localhost:5000)

---

## ✅ Verification

Visit `/api/health` to confirm backend status:

```
🚀 Starting CareMate Backend Server…
📍 Server: http://localhost:5000
🔑 AssemblyAI API Key: ✅ Set
🔑 Groq API Key: ✅ Set
```

---

## 🐛 Common Issues & Fixes

| Symptom                | Resolution                                                  |
| ---------------------- | ----------------------------------------------------------- |
| **Missing API keys**   | Ensure `.env` & `backend/.env` contain real keys            |
| **Module not found**   | `pip install -r requirements.txt`                           |
| **Connection refused** | Backend must be running on **:5000**                        |
| **CORS errors**        | Run both frontend & backend locally (CORS headers included) |

---

## 🧠 Roadmap / Future Additions

* Voice‑enabled chat agent (end‑to‑end)
* Wearable‑device integrations (Fitbit, Apple Watch)
* Advanced ML anomaly detection
* Role‑based access for clinics/hospitals
* Secure EHR interoperability (HL7/FHIR)
* Enhanced RBAC & MFA

---

## 🤝 Contributing

1. **Fork** the repo
2. **Create** a feature branch
3. **Commit** your changes (+ tests when possible)
4. **Open** a pull request & describe your work

Bug reports / feature ideas → [Issues](../../issues)

---

## 📄 License

Released under the **MIT License** – see [`LICENSE`](LICENSE) for details.

---

## 💙 Authors & Acknowledgments

Made with care by **Shine Gupta** and the CareMate community.

Questions? Email: [guptashine5002@gmail.com](mailto:guptashine5002@gmail.com)
