from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("❌ MONGO_URI is missing. Please check your .env file.")

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client['caremate']
collection = db['symptom_logs']

def save_symptom_log(phone, symptoms, language, reply):
    doc = {
        'phone': phone,
        'date': datetime.now(),
        'language': language,
        'symptom': symptoms,
        'bot_reply': reply
    }
    collection.insert_one(doc)
    print("🗃️ Saved symptom log for", phone)
