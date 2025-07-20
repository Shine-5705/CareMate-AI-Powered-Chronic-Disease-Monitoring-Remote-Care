import sounddevice as sd
import librosa
import numpy as np
import torch
import torch.nn as nn
from scipy.io.wavfile import write
import requests
import os
from dotenv import load_dotenv

# === Load API Keys ===
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# === Record 30-sec Audio ===
def record_audio(filename='customer_cough.wav', duration=30, fs=44100):
    print("Recording started... Speak or cough naturally.")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    write(filename, fs, recording)
    print(f"Recording saved as {filename}")
    return filename

# === Preprocess Audio (No Noise Reduction) ===
def preprocess_audio(file_path):
    y, sr = librosa.load(file_path, sr=None)

    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64)
    S_dB = librosa.power_to_db(S, ref=np.max)

    S_norm = (S_dB - np.min(S_dB)) / (np.max(S_dB) - np.min(S_dB))
    S_tensor = torch.tensor(S_norm).unsqueeze(0).unsqueeze(0).float()  # (1, 1, Mel, Time)
    return S_tensor

# === Simple CNN Model (Placeholder for real model) ===
class SimpleCoughCNN(nn.Module):
    def __init__(self):
        super(SimpleCoughCNN, self).__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 8, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(8, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(16, 2)  # Cough / No Cough
        )

    def forward(self, x):
        return self.net(x)

def load_model():
    model = SimpleCoughCNN()
    # For demo, random weights. Replace with trained model for production.
    model.eval()
    return model

# === Detect Cough ===
def detect_cough(audio_tensor, model):
    with torch.no_grad():
        output = model(audio_tensor)
        pred = torch.argmax(output, dim=1).item()
        if pred == 1:
            return "Cough Detected 🚨"
        else:
            return "No Cough Detected ✅"

# === Groq API for Care Instructions ===
def get_cough_care():
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-70b-8192",  # Use "mistral-7b-8k" if needed
        "messages": [
            {"role": "system", "content": "You are a healthcare assistant specialized in cough and respiratory care."},
            {"role": "user", "content": "A user has been detected with a cough. Suggest home remedies, when to see a doctor, and general care guidelines."}
        ],
        "temperature": 0.2
    }

    response = requests.post(url, headers=headers, json=payload)

    try:
        data = response.json()
    except Exception as e:
        return f"Error: Unable to parse Groq response. {str(e)}"

    if response.status_code != 200:
        return f"Groq API Error {response.status_code}: {data.get('error', {}).get('message', 'Unknown error')}"

    if "choices" not in data:
        return f"Groq API Response Error: {data}"

    return data['choices'][0]['message']['content']

# === Main Pipeline ===
def main():
    filename = record_audio()
    audio_tensor = preprocess_audio(filename)
    model = load_model()
    result = detect_cough(audio_tensor, model)

    print("\n--- Respiratory Analysis Result ---")
    print(result)

    if "Cough Detected" in result:
        print("\nContacting Groq AI for personalized care advice...")
        advice = get_cough_care()
        print("\n--- AI-Powered Cough Care Advice ---")
        print(advice)

if __name__ == "__main__":
    main()
