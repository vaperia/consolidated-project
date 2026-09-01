# db_manager.py

import sqlite3
import os

# Creates a table called logs in the database and ensure it only gets created if it does not already exist.
def create_table(db_name="chat_logs.db"):
    """Create a table to store chat logs if it doesn't exist."""
    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_input TEXT NOT NULL,
                chatbot_response TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()

# Reads user inputs from text file and stores them in database. Table for storing logs is created first if it doesn't exist.
def save_logs_from_file(file_name="user_inputs.txt", db_name="chat_logs.db"):
    """Read logs from a text file and save them to the SQLite database."""
    create_table(db_name)  # Ensure the table exists

    if not os.path.exists(file_name):
        print(f"File {file_name} does not exist.")
        return

    with open(file_name, 'r') as file:
        lines = file.readlines()

    with sqlite3.connect(db_name) as conn:
        cursor = conn.cursor()
        for line in lines:
            user_input = line.strip()
            if user_input:  # Avoid inserting empty lines
                cursor.execute("INSERT INTO logs (user_input) VALUES (?)", (user_input,))
        conn.commit()
    print("Logs saved to database.")

# Example usage (uncomment to test)
# save_logs_from_file()