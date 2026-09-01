from typing import Final

TOKEN: Final = 'insertbottoken'#insert bot token
BOT_USERNAME: Final = '@botname'#insert bot username

CONTROLS_API: Final = "http://192.168.50.102:8000"  # smart home controls (Pi)
CAMERA_API: Final = "http://192.168.50.102:5001"    # camera server (friend's computer)

# Keep BASE_API pointing to controls for backward compatibility with commands.py
BASE_API: Final = CONTROLS_API

ALLOWED_USERS: Final = [
    #123456789,  # Your chat ID

]
