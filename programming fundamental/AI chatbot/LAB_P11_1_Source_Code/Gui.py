import tkinter as tk
from tkinter import scrolledtext
from chatbot import send_to_chatGPT, listen_to_speech, speak_text
from file_manager import save_chatbot_response
from weather import extract_city, get_weather
import sqlite3
import threading
import time
from PIL import Image, ImageTk

base_imgs = ['2Drest.png', '2Dopen1.png', '2Dopen2.png']
imgLabel = 1
is_talking = [False]

# Sets window's icon, load multiple images and animated character
# Sets up a canvas with blue background and places character images
# Adds an input frame, adds a 'ScrolledText' chat log and submit button & MIC button
def setup_gui_components(root, width, height):
    global base_imgs, imgLabel

    #Window Icon
    ico = Image.open('res\\Jerome.PNG')
    photo = ImageTk.PhotoImage(ico)
    root.wm_iconphoto(False, photo)

    #Try 2D
    for i in range(len(base_imgs)):
        try:
            base_imgs[i] = Image.open('res\\'+base_imgs[i])
            base_imgs[i] = ImageTk.PhotoImage(base_imgs[i].resize((130, 130)))
        except:
            print("Check if res file has Images present")
            imgLabel = 0
            break 

    canvas = tk.Canvas(root, width=width, height=height, bg='light blue')
    canvas.pack(fill=tk.BOTH, expand=True)

    imgLabel = tk.Label(root, bg = 'light blue', image=base_imgs[0])
    imgLabel.place(x=0, y=0)

    # Frame and Input setup
    mode_frame = tk.Frame(root, bg='#80c1ff', bd=5)
    mode_frame.place(relx=0.5, rely=0.1, relheight=0.07, width=300, anchor='n')

    # input_mode_label = tk.Label(mode_frame, text="Input Mode:", font=('helvetica', 16))  
    # input_mode_label.pack(side=tk.LEFT, padx=10) 

    heading = tk.Label(root, bg='light pink', text="Pirate Yuna", font=('helveticat', 30))
    heading.place(relx=0.5, rely=0.01, relheight=0.05, relwidth=0.3, anchor='n')

    frame = tk.Frame(root, bg='#80c1ff', bd=5)
    frame.place(relx=0.5, rely=0.2, relheight=0.1, relwidth=0.75, anchor='n')

    output_mode_label = tk.Label(mode_frame, text="Output Mode:", font=('helvetica', 16))
    output_mode_label.pack(side=tk.LEFT, padx=(15, 10)) 

    # Output Mode (text/speech)
    output_mode_var = tk.StringVar(value='text')
    output_text_radio = tk.Radiobutton(mode_frame, text="Text", variable=output_mode_var, value='text')
    output_speech_radio = tk.Radiobutton(mode_frame, text="Speech", variable=output_mode_var, value='speech')
    output_text_radio.pack(side=tk.LEFT)
    output_speech_radio.pack(side=tk.LEFT)

    # Input field for user input
    input_field = tk.Entry(frame, font=40)
    input_field.place(relwidth=0.55, relheight=1)

    # Scrolled text box for chat log
    chat_log = scrolledtext.ScrolledText(root, bg='#f0f0f0', state=tk.DISABLED, font=('Helvetica', 14))
    chat_log.place(relx=0.5, rely=0.35, relheight=0.6, relwidth=0.8, anchor='n')

    # Submit button
    submit_button = tk.Button(
        frame,
        text="Submit",
        bg='white',
        command=lambda: handle_input(input_field, chat_log, output_mode_var)
    )
    submit_button.place(relx=0.6, relheight=1, relwidth=0.2)

    # MIC button for push-to-talk
    mic_button = tk.Button(
        frame,
        text="MIC",
        bg="white",
        command=lambda: handle_mic_input(chat_log, output_mode_var)
    )
    mic_button.place(relx=0.8, relheight=1, relwidth=0.2)

    # Update the binding for the <Return> event
    input_field.bind('<Return>', lambda event: handle_input(input_field, chat_log, output_mode_var))

# Animates character by updating the image in 'imgLabel' to simulate speech
def talk_animation():
    global imgLabel, base_imgs
    imgLabel.configure(image=base_imgs[1])
    imgLabel.image = base_imgs[1]
    imgLabel.update()
    time.sleep(0.5)
    imgLabel.configure(image=base_imgs[2])
    imgLabel.image = base_imgs[2]
    imgLabel.update()
    time.sleep(0.5)
    imgLabel.configure(image=base_imgs[0])
    imgLabel.image = base_imgs[0]
    imgLabel.update()
    time.sleep(0.5)

# Responsible for handling all input types, updates chatlog
# Output mode (Speech or Text)
# If speech mode is enabled, animates chatbot and make it looks like its talking
def handle_all_input(user_input, chat_log, output_mode_var):
    global base_imgs, imgLabel, is_talking
    if user_input.strip():  # Check for non-empty input
        # Check if the user input contains a weather-related question
        if 'weather' in user_input.lower() or 'forecast' in user_input.lower():
            city = extract_city(user_input)
            if city:
                weather_info = get_weather(city)
                chatbot_response = weather_info
                print(city)
        else:
            # Get the chatbot's response
            chatbot_response = send_to_chatGPT(user_input)
            
            # Save chatbot response
            if chatbot_response is not None:
                save_chatbot_response(chatbot_response, user_input)

                try:
                    with sqlite3.connect("chat_logs.db") as conn:
                        cursor = conn.cursor()
                        cursor.execute("INSERT INTO logs (user_input, chatbot_response) VALUES (?, ?)", (user_input, chatbot_response))
                        conn.commit()  # Commit the changes to the database
                        print("Data saved successfully")
                except sqlite3.Error as e:
                    print("Database error:", e)

        # Display the conversation in the chat log
        chat_log.config(state=tk.NORMAL)  # Allow editing
        chat_log.insert(tk.END, f"You: {user_input}\n")
        chat_log.insert(tk.END, f"Yuna bot: {chatbot_response}\n")
        chat_log.config(state=tk.DISABLED)  # Prevent editing

        # If output mode is set to 'speech', use TTS to speak the response
        if output_mode_var.get() == "speech":
            t1 = threading.Thread(target=speak_text, args=(chatbot_response, is_talking))
            #speak_text(chatbot_response)
            t1.start()
            while(is_talking[0]):
                talk_animation()
            t1.join()
        else:
            for i in range(3):
                talk_animation()
        chat_log.yview(tk.END)

# Triggered when user types a message and presses 'submit', retrieves input, clears input field and processes through this function
def handle_input(input_field, chat_log, output_mode_var):
    user_input = input_field.get()
    input_field.delete(0, tk.END)  # Clear the input field
    handle_all_input(user_input, chat_log, output_mode_var)

# Listens to user's speech using 'listen_to_speech()' and sends the recgonized text to handle_all_input()
def handle_mic_input(chat_log, output_mode_var):
    # Listen to speech
    handle_all_input(listen_to_speech(), chat_log, output_mode_var)