import requests
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-70b-8192"

def call_health_assistant(messages):
    if not GROQ_API_KEY:
        raise Exception("❌ GROQ_API_KEY is missing. Check your .env file.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512
    }

    try:
        res = requests.post(GROQ_ENDPOINT, headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        return res.json()['choices'][0]['message']['content'].strip()
    except requests.exceptions.RequestException as e:
        raise Exception(f"❌ Groq API error: {str(e)}")
