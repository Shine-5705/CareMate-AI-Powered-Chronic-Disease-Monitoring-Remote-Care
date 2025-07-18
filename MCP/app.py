from flask import Flask
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from routes import register_routes
from scheduler import send_daily_checkin

app = Flask(__name__)
CORS(app)

register_routes(app)

# Start the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(send_daily_checkin, 'cron', hour=9)  # 9 AM daily
scheduler.start()

if __name__ == '__main__':
    print("🚀 CareMate AI Backend running on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
