import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7
}

res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)

print(res.status_code)
print(res.text)
