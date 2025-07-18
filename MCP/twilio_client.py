from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"  # Twilio sandbox fixed number

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_whatsapp_message(to, body):
    message = client.messages.create(
        body=body,
        from_=TWILIO_WHATSAPP_NUMBER,
        to=f"whatsapp:{to}"
    )
    print(f"✅ Sent WhatsApp message to {to}")
    return message.sid
