# CareMate Backend API

Python Flask backend for the CareMate AI Health Assistant.

## Setup

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys to `.env`:
   ```env
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the server**:
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /api/health-chat
Chat with the AI health assistant.

**Request**:
```json
{
  "message": "मुझे सिरदर्द हो रहा है",
  "language": "hi",
  "chatHistory": []
}
```

**Response**:
```json
{
  "response": "मुझे खुशी है कि आपने अपनी समस्या साझा की...",
  "language": "hi",
  "success": true
}
```

### POST /api/transcribe
Transcribe audio to text.

**Request**: Form data with audio file

**Response**:
```json
{
  "transcript": "मुझे सिरदर्द हो रहा है",
  "language": "hi",
  "success": true
}
```

### POST /api/detect-language
Detect language of text.

**Request**:
```json
{
  "text": "मुझे सिरदर्द हो रहा है"
}
```

**Response**:
```json
{
  "language": "hi",
  "confidence": 0.9,
  "success": true
}
```