import google.generativeai as genai
import os
from PIL import Image
import io

# Setup Gemini API
genai.configure(api_key="AIzaSyCBKfdAC-F7aIk54FNpHKcEnHh9mqZLpBI")  # Replace with your API key

# Load your image
image_path = r"C:\Users\gupta\OneDrive\Desktop\CareMate-AI-Powered-Chronic-Disease-Monitoring-Remote-Care\asset\cutimage.png"
image = Image.open(image_path)

# Use Gemini 1.5 Flash or Pro
model = genai.GenerativeModel('gemini-1.5-flash')  # For faster response
# model = genai.GenerativeModel('gemini-1.5-pro')  # For more detailed answers

# Build the multimodal prompt
prompt = """
You are a medical AI assistant specialized in skin analysis.

Given the image, do the following:

1. Describe what is happening in the image. Identify possible skin conditions (rash, burn, infection, eczema, etc.)
2. Predict possible causes (e.g., allergic reaction, sun exposure, infection, etc.)
3. Provide immediate first aid recommendations.
4. Provide long-term care suggestions or lifestyle changes to prevent recurrence.

Be concise but clear. Use simple language understandable to a non-medical user.
"""

# Generate response
response = model.generate_content(
    [
        prompt,
        image
    ]
)

print("Skin Diagnosis and Recommendations:\n")
print(response.text)
