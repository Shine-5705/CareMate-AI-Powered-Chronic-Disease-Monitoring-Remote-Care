import streamlit as st
from streamlit_webrtc import webrtc_streamer, AudioProcessorBase
import numpy as np
import threading
import requests
import time
import tempfile
import os
import pyttsx3
from dotenv import load_dotenv
from translate import translate_text, detect_language
import speech_recognition as sr
from streamlit_webrtc import WebRtcMode


# Load API Keys
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Init TTS
engine = pyttsx3.init()
speech_lock = threading.Lock()

def speak(text):
    def _speak():
        with speech_lock:
            engine.say(text)
            engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()

# Groq API Call
def call_health_assistant(messages):
    GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512,
        "top_p": 0.9
    }
    res = requests.post(GROQ_ENDPOINT, headers=headers, json=payload)
    data = res.json()
    if "choices" in data:
        return data["choices"][0]["message"]["content"]
    else:
        return "Error: Unable to get response from health assistant."

# Audio Processor for WebRTC
class AudioProcessor(AudioProcessorBase):
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.audio_data = []

    def recv_audio(self, frame):
        self.audio_data.append(frame.to_ndarray().flatten())
        return frame

    def get_transcription(self):
        audio_np = np.concatenate(self.audio_data).astype(np.int16)
        audio_bytes = audio_np.tobytes()
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(audio_bytes)
            filename = f.name
        try:
            with sr.AudioFile(filename) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio, language="hi-IN")
                return text
        except Exception as e:
            return f"Error in transcription: {str(e)}"
        finally:
            os.unlink(filename)

# Streamlit UI
st.set_page_config(page_title="CareMate Health AI", layout="wide")
st.title("🤖 CareMate: AI Health Companion")

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "language" not in st.session_state:
    st.session_state.language = "en"

st.markdown("##### You can type or use your mic to chat with CareMate")

# Display Chat
for entry in st.session_state.chat_history:
    role, content = entry
    if role == "user":
        st.markdown(f"**You:** {content}")
    else:
        st.markdown(f"**CareMate:** {content}")

# Text Input
text_input = st.text_input("Type your message:", key="text_input")

# Mic Input
audio_processor = webrtc_streamer(
    key="mic",
    mode=WebRtcMode.SENDRECV,  # ✅ Correct Enum
    media_stream_constraints={"audio": True, "video": False},
    audio_processor_factory=AudioProcessor,
)

# Process Text Input
if st.button("Send Text") and text_input.strip() != "":
    user_input = text_input.strip()
    st.session_state.text_input = ""
    lang = detect_language(user_input)
    st.session_state.language = lang
    translated_input = translate_text(user_input, target_lang="en")
    st.session_state.chat_history.append(("user", user_input))

    # Prepare messages
    system_prompt = {
        "role": "system",
        "content": (
            "You are CareMate, a multilingual AI health assistant helping Indian users understand symptoms and know when to seek medical care. "
            "Ask follow-up questions, suggest safe remedies, and recommend doctor consultation when needed."
        )
    }
    messages = [system_prompt]
    for role, content in st.session_state.chat_history:
        role_mapping = "user" if role == "user" else "assistant"
        translated = translate_text(content, target_lang="en") if role == "user" else content
        messages.append({"role": role_mapping, "content": translated})

    response = call_health_assistant(messages)
    localized_reply = translate_text(response, target_lang=lang)
    st.session_state.chat_history.append(("assistant", localized_reply))
    speak(localized_reply)
    st.rerun()

# Process Mic Input
if audio_processor and audio_processor.audio_processor:
    if st.button("Send Voice"):
        transcription = audio_processor.audio_processor.get_transcription()
        lang = detect_language(transcription)
        st.session_state.language = lang
        translated_input = translate_text(transcription, target_lang="en")
        st.session_state.chat_history.append(("user", transcription))

        # Prepare messages
        system_prompt = {
            "role": "system",
            "content": (
                "You are CareMate, a multilingual AI health assistant helping Indian users understand symptoms and know when to seek medical care. "
                "Ask follow-up questions, suggest safe remedies, and recommend doctor consultation when needed."
            )
        }
        messages = [system_prompt]
        for role, content in st.session_state.chat_history:
            role_mapping = "user" if role == "user" else "assistant"
            translated = translate_text(content, target_lang="en") if role == "user" else content
            messages.append({"role": role_mapping, "content": translated})

        response = call_health_assistant(messages)
        localized_reply = translate_text(response, target_lang=lang)
        st.session_state.chat_history.append(("assistant", localized_reply))
        speak(localized_reply)
        st.rerun()

# Analysis Button
if st.button("Analyze Conversation"):
    system_prompt = {
        "role": "system",
        "content": (
            "You are CareMate, an AI health assistant. Now summarize the conversation so far and provide:\n"
            "- Symptom summary\n"
            "- Possible causes (no diagnosis)\n"
            "- Safe home care tips\n"
            "- When to consult a doctor\n"
            "End with: 'Would you like me to continue checking your symptoms or connect you to a doctor?'"
        )
    }
    messages = [system_prompt]
    for role, content in st.session_state.chat_history:
        role_mapping = "user" if role == "user" else "assistant"
        translated = translate_text(content, target_lang="en") if role == "user" else content
        messages.append({"role": role_mapping, "content": translated})

    response = call_health_assistant(messages)
    localized_reply = translate_text(response, target_lang=st.session_state.language)
    st.session_state.chat_history.append(("assistant", localized_reply))
    speak(localized_reply)
    st.rerun()
