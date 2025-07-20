import google.generativeai as genai
from PIL import Image
import pyttsx3
import threading
import time
from googletrans import Translator
import keyboard

# ===== Setup Gemini API =====
genai.configure(api_key="AIzaSyCBKfdAC-F7aIk54FNpHKcEnHh9mqZLpBI")  # Replace with your API key

# ===== Setup Text-to-Speech =====
engine = pyttsx3.init()
speech_lock = threading.Lock()

def speak(text, lang):
    voices = engine.getProperty('voices')
    for voice in voices:
        if lang in voice.languages or lang in voice.id:
            engine.setProperty('voice', voice.id)
            break
    def _speak():
        with speech_lock:
            engine.say(text)
            engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()
    return thread

def stop_speech():
    with speech_lock:
        engine.stop()

# ===== Setup Translator =====
translator = Translator()

def translate_text(text, target_lang='en'):
    return translator.translate(text, dest=target_lang).text

def detect_language(text):
    return translator.detect(text).lang

# ===== Load Image =====
image_path = r"C:\Users\gupta\OneDrive\Desktop\CareMate-AI-Powered-Chronic-Disease-Monitoring-Remote-Care\asset\cutimage.png"  # Replace with your image file path
image = Image.open(image_path)

# ===== Gemini Prompt =====
prompt = """
You are a medical AI assistant specialized in dermatology.

Given the image, do the following:

1. Describe the skin condition in the image in simple terms.
2. List possible causes for this condition.
3. Suggest immediate first aid or home remedies.
4. Provide long-term care and prevention advice.

Respond in a clear and concise way for a layperson.
"""

# ===== Use Gemini 1.5 =====
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content(
    [
        prompt,
        image
    ]
)

diagnosis_output = response.text
print("\n🔍 AI Diagnosis (English):\n")
print(diagnosis_output)

# ===== Detect User Language =====
print("\nPlease say or type a sample sentence in your language to set language preference:")
user_sample = input("User Input: ")
user_lang = detect_language(user_sample)
print(f"\n🌐 Detected language: {user_lang}")

# ===== Translate to User Language =====
translated_output = translate_text(diagnosis_output, target_lang=user_lang)

print("\n🗣️ Translated Diagnosis:\n")
print(translated_output)

# ===== Speak Out Loud =====
stop_speech()
thread = speak(translated_output, lang=user_lang)

print("\nPress 's' to stop voice output early...")

while thread.is_alive():
    if keyboard.is_pressed("s"):
        stop_speech()
        print("Voice output stopped.")
        break
    time.sleep(0.1)
