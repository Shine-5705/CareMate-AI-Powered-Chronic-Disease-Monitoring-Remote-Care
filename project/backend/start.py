#!/usr/bin/env python3
"""
CareMate Backend Startup Script
"""
import os
import sys
from dotenv import load_dotenv

def check_requirements():
    """Check if all required packages are installed"""
    try:
        import flask
        import flask_cors
        import requests
        import dotenv
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_api_keys():
    """Check if API keys are configured"""
    load_dotenv()
    
    assemblyai_key = os.getenv("ASSEMBLYAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    print("\n🔑 API Key Status:")
    print(f"AssemblyAI: {'✅ Configured' if assemblyai_key and assemblyai_key != 'your_assemblyai_api_key_here' else '❌ Not configured'}")
    print(f"Groq: {'✅ Configured' if groq_key and groq_key != 'your_groq_api_key_here' else '❌ Not configured'}")
    
    if not assemblyai_key or assemblyai_key == 'your_assemblyai_api_key_here':
        print("\n❌ Please set your AssemblyAI API key in backend/.env file")
        print("Get your key from: https://www.assemblyai.com/")
        return False
        
    if not groq_key or groq_key == 'your_groq_api_key_here':
        print("\n❌ Please set your Groq API key in backend/.env file")
        print("Get your key from: https://console.groq.com/")
        return False
    
    return True

def main():
    print("🚀 CareMate Backend Setup")
    print("=" * 40)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please copy .env.example to .env and add your API keys")
        return
    
    # Check requirements
    if not check_requirements():
        return
    
    # Check API keys
    if not check_api_keys():
        print("\n📝 To fix this:")
        print("1. Edit backend/.env file")
        print("2. Replace 'your_assemblyai_api_key_here' with your actual AssemblyAI API key")
        print("3. Replace 'your_groq_api_key_here' with your actual Groq API key")
        print("4. Run this script again")
        return
    
    print("\n✅ All checks passed! Starting server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("🔄 Press Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start the Flask app
    from app import app
    app.run(debug=True, port=5000, host='0.0.0.0')

if __name__ == '__main__':
    main()