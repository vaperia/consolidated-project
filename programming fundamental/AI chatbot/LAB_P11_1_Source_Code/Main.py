# Code Cleanup plus Pirate personality added
import tkinter as tk
from Gui import setup_gui_components
from db_manager import create_table
from settings import open_settings

if __name__ == "__main__":
    root = tk.Tk()
    root.title("Chatbot Interface")

    HEIGHT = 700
    WIDTH = 800

    # Call setup GUI function from gui.py
    setup_gui_components(root, WIDTH, HEIGHT)

    # Menu bar for settings
    menu_bar = tk.Menu(root)
    settings_menu = tk.Menu(menu_bar, tearoff=0)
    settings_menu.add_command(label="Settings", command=lambda: open_settings(root))
    menu_bar.add_cascade(label="Menu", menu=settings_menu)
    root.config(menu=menu_bar)

    create_table()

    root.mainloop()