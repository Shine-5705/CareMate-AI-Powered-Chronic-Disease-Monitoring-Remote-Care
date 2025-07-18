from flask import request, jsonify
from datetime import datetime
from mistral_client import call_health_assistant
from translate_client import detect_language
from db import save_symptom_log
from twilio_client import send_whatsapp_message
from health_logic import check_emergency
from twilio.twiml.messaging_response import MessagingResponse

def register_routes(app):
    @app.route('/api/health-chat', methods=['POST'])
    def health_chat():
        """
        For frontend, Postman or direct API use (phone + message provided in JSON)
        """
        data = request.json
        message = data.get('message', '').strip()
        phone = data.get('phone', '').strip()
        language = detect_language(message)

        system_prompt = {
            "role": "system",
            "content": f"""You are CareMate, a multilingual AI health assistant.

- Respond only in {language.upper()}
- Be empathetic and culturally relevant
- Suggest safe home remedies
- Advise when to see a doctor
- Do NOT prescribe medicines
- End every response with: "Would you like me to continue checking your symptoms or help connect you to a doctor?" """
        }

        messages = [system_prompt, {"role": "user", "content": message}]
        reply = call_health_assistant(messages)

        if check_emergency(message):
            reply += "\n\n⚠️ Your symptoms may be serious. Please visit a doctor immediately."

        send_whatsapp_message(phone, reply)
        save_symptom_log(phone, message, language, reply)

        return jsonify({
            'response': reply,
            'language': language,
            'success': True,
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/whatsapp-inbound', methods=['POST'])
    def whatsapp_inbound():
        """
        For Twilio WhatsApp webhook (messages directly from users)
        """
        incoming_msg = request.form.get('Body')
        from_number = request.form.get('From').replace('whatsapp:', '')

        print(f"📲 Incoming WhatsApp message from {from_number}: {incoming_msg}")

        language = detect_language(incoming_msg)

        system_prompt = {
            "role": "system",
            "content": f"""You are CareMate, a multilingual AI health assistant.

- Respond only in {language.upper()}
- Be empathetic and culturally relevant
- Suggest safe home remedies
- Advise when to see a doctor
- Do NOT prescribe medicines
- End every response with: "Would you like me to continue checking your symptoms or help connect you to a doctor?" """
        }

        messages = [system_prompt, {"role": "user", "content": incoming_msg}]
        reply = call_health_assistant(messages)

        if check_emergency(incoming_msg):
            reply += "\n\n⚠️ Your symptoms may be serious. Please visit a doctor immediately."

        save_symptom_log(from_number, incoming_msg, language, reply)

        # Create WhatsApp reply using Twilio MessagingResponse
        resp = MessagingResponse()
        resp.message(reply)

        return str(resp)

