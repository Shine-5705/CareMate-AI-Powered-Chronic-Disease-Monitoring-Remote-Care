from db import db
from twilio_client import send_whatsapp_message

def send_daily_checkin():
    users = db['symptom_logs'].distinct('phone')
    for user in users:
        send_whatsapp_message(user, "🩺 Hello! This is your daily health check-in. Reply with any symptoms you’re feeling today.")
