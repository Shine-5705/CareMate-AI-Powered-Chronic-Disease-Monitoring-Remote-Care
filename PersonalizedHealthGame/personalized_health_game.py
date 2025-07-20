import os
import time
import random
import requests
from dotenv import load_dotenv

# Load .env variables
load_dotenv()


class PersonalizedHealthGame:
    def __init__(self):
        self.user_data = {}
        self.points = 0
        self.tasks = []

    def collect_user_data(self):
        print("Welcome to Personalized Health Hero! 🎯\n")
        self.user_data['name'] = input("Enter your name: ")
        self.user_data['age'] = int(input("Enter your age: "))
        self.user_data['weight'] = float(input("Enter your weight (kg): "))
        self.user_data['height'] = float(input("Enter your height (cm): "))
        self.user_data['health_conditions'] = input("Any health conditions? (e.g., asthma, none): ").lower()
        self.user_data['goal'] = input("What is your fitness goal? (e.g., lose weight, gain strength, stay active): ").lower()
        print("\nGenerating personalized tasks using AI...\n")
        time.sleep(2)

    def fetch_tasks_from_groq(self):
        GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

        prompt = f"""
        You are a professional fitness coach and health expert.

        Based on the following user details, generate 5 safe, personalized fitness tasks that help improve health and fitness.

        Each task should be concise, actionable, and include duration or repetitions.

        User details:
        - Age: {self.user_data['age']}
        - Weight: {self.user_data['weight']} kg
        - Height: {self.user_data['height']} cm
        - Health Conditions: {self.user_data['health_conditions']}
        - Fitness Goal: {self.user_data['goal']}

        Provide tasks in numbered list format.
        """

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "system", "content": "You are an expert fitness coach."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(GROQ_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            tasks_response = response.json()['choices'][0]['message']['content']
            self.tasks = tasks_response.split('\n')
        else:
            print(f"Groq API Error: {response.status_code} - {response.text}")
            exit()

    def start_tasks(self):
        for task in self.tasks:
            task_clean = task.strip()
            if task_clean == '':
                continue
            print(f"📝 {task_clean}")
            input("Press Enter after completing and recording the task 📹...")

            self.simulate_verification(task_clean)

    def simulate_verification(self, task):
        print("Verifying task completion...")
        time.sleep(1.5)
        success = random.choice([True, True, False])  # Mostly success

        if success:
            print(f"✅ Task '{task}' verified! +10 points.\n")
            self.points += 10
        else:
            print(f"❌ Task '{task}' video unclear. No points awarded.\n")

    def show_summary(self):
        print(f"\n🎯 Summary for {self.user_data['name']}:")
        print(f"Total Points: {self.points}")

        if self.points >= len(self.tasks) * 8:
            print("🏆 Excellent! You're a Health Champion!")
        else:
            print("💪 Good effort! Keep practicing.")

    def run(self):
        self.collect_user_data()
        self.fetch_tasks_from_groq()
        self.start_tasks()
        self.show_summary()

if __name__ == "__main__":
    game = PersonalizedHealthGame()
    game.run()
