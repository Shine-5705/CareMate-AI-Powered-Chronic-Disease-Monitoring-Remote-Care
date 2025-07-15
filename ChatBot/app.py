from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from translate import translate_text, detect_language

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = "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"
MODEL_NAME = "llama3-70b-8192"
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

def call_llama(prompt):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are CareMate, an experienced and multilingual AI health assistant built for India, focused on early symptom triage and wellness advice.\n\n"
                    "Your personality is calm, kind, and helpful—like a local doctor. You ask relevant follow-up questions before suggesting anything. "
                    "You never give direct prescriptions or diagnoses. You provide safe, general advice based on symptoms only.\n\n"
                    "Start by asking the user for more detail: What other symptoms do they have? When did it start? Are they feeling tired, or having trouble breathing?\n\n"
                    "Then, based on common conditions, share basic remedies (like hydration, rest, steam inhalation, etc.) only if it's safe.\n\n"
                    "You must clearly explain when a symptom sounds serious and advise the user to contact a real doctor. Be especially careful with symptoms like chest pain, high fever, shortness of breath, dizziness, or pre-existing conditions.\n\n"
                    "Never guess a disease name. Never prescribe any medicine. Speak clearly in short, friendly paragraphs. Avoid medical jargon.\n\n"
                    "Always end by asking: 'Would you like me to keep checking your symptoms or connect you to a doctor?'"
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 512,
        "top_p": 0.9
    }

    response = requests.post(GROQ_ENDPOINT, headers=headers, json=payload)
    result = response.json()

    if "choices" in result and result["choices"]:
        return result["choices"][0]["message"]["content"].strip()
    elif "error" in result:
        print("Groq API error:", result["error"])
        return "Sorry, there was a problem with the AI model. Please try again later."
    else:
        return "Sorry, I couldn't process that. Please try again later."

@app.route("/ask_health", methods=["POST"])
def ask_health():
    data = request.get_json()
    user_input = data.get("message")

    if not user_input:
        return jsonify({"error": "Message cannot be empty"}), 400

    try:
        # Detect language
        lang = detect_language(user_input)

        # Translate to English for model input
        translated_input = translate_text(user_input, target_lang='en')

        # Get AI reply in English
        english_reply = call_llama(translated_input)

        # Translate back to original language
        localized_reply = translate_text(english_reply, target_lang=lang)

        return jsonify({
            "reply": localized_reply,
            "language": lang
        })

    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
