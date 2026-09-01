# file_manager.py

# Saves the conversation between the user and the chatbot to a textfile 'chatbot_responses.txt'
def save_chatbot_response(response, user_input):
    """Append the chatbot response to a text file."""
    with open("chatbot_responses.txt", "a") as f:
        f.write(f"You: {user_input}\n")
        f.write(f"Yuna: {response}\n\n")  # Adding extra newline for readability