from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from translate import translate_text, detect_language

app = Flask(__name__)
CORS(app)

# Replace this with your actual Groq API key
GROQ_API_KEY = ""
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
MODEL_NAME = "llama3-70b-8192"

def call_mixtral(prompt):
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
                    "You are CareMate, a multilingual AI health assistant for India. "
                    "Your goal is to help users understand their symptoms in simple terms, "
                    "suggest safe home remedies when appropriate, and tell them when to consult a doctor. "
                    "Respond in plain, easy-to-understand language."
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

    try:
        result = response.json()
        print("Groq API raw response:", result)  # <-- DEBUG LINE

        if "choices" in result and result["choices"]:
            return result["choices"][0]["message"]["content"].strip()
        else:
            return "Sorry, I couldn't process that. Please try again later."

    except Exception as e:
        return f"Error parsing response: {str(e)}"

@app.route("/ask_health", methods=["POST"])
def ask_health():
    data = request.get_json()
    user_input = data.get("message")

    if not user_input:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Detect language
    lang = detect_language(user_input)
    
    # Translate to English for LLM
    translated_input = translate_text(user_input, target_lang='en')

    # Generate response
    try:
        english_response = call_mixtral(translated_input)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Translate back to original language
    localized_reply = translate_text(english_response, target_lang=lang)

    return jsonify({
        "reply": localized_reply,
        "language": lang
    })

if __name__ == "__main__":
    app.run(debug=True)
