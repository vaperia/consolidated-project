import tkinter as tk
import pyttsx3
from PIL import Image, ImageTk

# Initialize the TTS engine
tts_engine = pyttsx3.init()

# Creates a new window for configuring the settings
def open_settings(root):
    settings_window = tk.Toplevel(root)
    settings_window.title("Settings")

    #Window Icon
    ico = Image.open('res\\2Drest.png')
    photo = ImageTk.PhotoImage(ico)
    settings_window.wm_iconphoto(False, photo)

    # Volume setting
    volume_label = tk.Label(settings_window, text="Set Volume (0.0 to 1.0):")
    volume_label.pack()
    
    volume_scale = tk.Scale(settings_window, from_=0.0, to=1.0, resolution=0.1, orient=tk.HORIZONTAL)
    volume_scale.set(1.0)  # Default volume
    volume_scale.pack()

    # Voice selection
    voice_button = tk.Button(settings_window, text="Select Voice", command=lambda: open_voice_settings(settings_window))
    voice_button.pack()

    # Save button
    save_button = tk.Button(settings_window, text="Save", command=lambda: save_settings(volume_scale.get()))
    save_button.pack()

# Sets the volume to the value provided by 'volume_scale' widget and prints the new volume to the console.
def save_settings(volume):
    tts_engine.setProperty('volume', volume)
    print(f"Volume set to: {volume}")

# Retrieves available voices from TTS engine and returns them as a list of names.
def list_voices():
    voices = tts_engine.getProperty('voices')
    voice_names = [voice.name for voice in voices]
    return voice_names

# Opens another window 'voice_window' where the user can select a TTS voice
# Displays all avaiable voices as RadioButtons.
# One voice is selected, user clicks 'save', which triggers the 'save_voice()' function.
def open_voice_settings(parent_window):
    voice_window = tk.Toplevel(parent_window)
    voice_window.title("Select Voice")
    
    voice_names = list_voices()
    voice_var = tk.StringVar(value=voice_names[0])  # Default to the first voice

    for voice_name in voice_names:
        tk.Radiobutton(voice_window, text=voice_name, variable=voice_var, value=voice_name).pack(anchor=tk.W)
    
    save_button = tk.Button(voice_window, text="Save", command=lambda: save_voice(voice_var.get()))
    save_button.pack()

# Sets the TTS engine to use the voice selected by the user which matches the selected voice name with the voice properties of the TTS engine.
def save_voice(selected_voice):
    voices = tts_engine.getProperty('voices')
    for voice in voices:
        if voice.name == selected_voice:
            tts_engine.setProperty('voice', voice.id)
            print(f"Voice set to: {selected_voice}")
            break