import openai
import pyttsx3
import speech_recognition as sr
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv('OPEN_AI_KEY')

# Initialize engines
recognizer = sr.Recognizer()
tts_engine = pyttsx3.init()
messages = [{"role": "system", "content": "You are a pirate chatbot. Respond to all messages in pirate speak, using pirate slang, expressions, and mannerisms. Be gruff but helpful, and always maintain your pirate character."}]

# Sends user's input to GPT-4, wraps the user input to pirate-speak theme
def send_to_chatGPT(user_input, model_name="gpt-4"):
    pirate_input = f"Ahoy matey! A landlubber be sayin': '{user_input}' What say ye, ya scurvy dog?"
    messages.append({"role": "user", "content": pirate_input})
    try:
        response = openai.chat.completions.create(
            model=model_name,
            messages=messages,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Blimey! There be an error gettin' a response from the OpenAI seas: {e}")
        return "Arrr! Me brain's gone foggy. Can't give ye a proper answer, ye bilge rat!"

# Uses 'pyttsx3' to speak out text more like a pirate voice
def speak_text(text, is_talking):
    tts_engine = pyttsx3.init()
    tts_engine.setProperty('rate', 150)
    tts_engine.setProperty('voice', 'english+m3')  # Try to set a more gruff voice if available

    is_talking[0] = True
    tts_engine.say(text)
    tts_engine.runAndWait()
    is_talking[0] = False

# Captures input from mic and returns as text
def listen_to_speech():
    with sr.Microphone() as source:
        print("Ahoy! Speak up, ye scallywag!")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
    
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Arrr! Ye be speakin' in tongues, matey!"
    except sr.RequestError as e:
        return f"Shiver me timbers! The wind's against us: {e}"