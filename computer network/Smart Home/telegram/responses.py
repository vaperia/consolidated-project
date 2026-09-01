import asyncio
import requests
from telegram import Update
from telegram.ext import ContextTypes
from config import BOT_USERNAME, ALLOWED_USERS


# Static main menu buttons
BUTTON_MAP = {
    "🪟 Windows":     "window",
    "💡 Light":       "light",
    "🌀 Fan":          "fan",
    "🚪 Door":         "door",
    "📊 Check State":  "checkstate",
    "🌡 Temp":         "temp",
    "🌧 Weather":      "weather",
    "🤖 Auto Mode":    "automode",
    "🔙 Back":         "menu",
}

# Auto submenu buttons use dynamic labels like "🌀 Fan Auto ON 🟢" / "🌀 Fan Auto OFF 🔴"
# so we match by prefix instead of exact string
AUTO_SUBMENU_PREFIXES = {
    "🤖 Master Auto": "toggle_master",
    "🌀 Fan Auto":    "toggle_fan",
    "🪟 Window Auto": "toggle_window",
    "💡 Light Auto":  "toggle_light",
}


def handle_response(text: str) -> str:
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": f"You are Homie, a calm and practical home assistant bot. Reply briefly and clearly. User: {text}",
                "stream": False,
            },
            timeout=15,
        )
        return response.json()["response"]
    except Exception as e:
        print(f"[Ollama] Error: {e}")
        return "Sorry, I could not reach the AI right now."


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if user_id not in ALLOWED_USERS:
        print(f"[AUTH] Blocked message from unauthorised user {user_id}")
        return

    message_type: str = update.message.chat.type
    text: str = update.message.text

    print(f'User ({update.message.chat.id}) in {message_type}: "{text}"')

    from commands import (
        window_command, light_command, fan_command, door_command,
        checkstate_command, temp_command, weather_command,
        automode_command, menu_command,
        toggle_master_auto, toggle_fan_auto, toggle_window_auto, toggle_light_auto,
    )

    cmd_map = {
        "window":        window_command,
        "light":         light_command,
        "fan":           fan_command,
        "door":          door_command,
        "checkstate":    checkstate_command,
        "temp":          temp_command,
        "weather":       weather_command,
        "automode":      automode_command,
        "menu":          menu_command,
        "toggle_master": toggle_master_auto,
        "toggle_fan":    toggle_fan_auto,
        "toggle_window": toggle_window_auto,
        "toggle_light":  toggle_light_auto,
    }

    # Check static buttons first
    if text in BUTTON_MAP:
        await cmd_map[BUTTON_MAP[text]](update, context)
        return

    # Check auto submenu buttons (dynamic ON/OFF suffix) by prefix
    for prefix, cmd_key in AUTO_SUBMENU_PREFIXES.items():
        if text.startswith(prefix):
            await cmd_map[cmd_key](update, context)
            return

    # Otherwise route to Ollama LLM
    if message_type in ("group", "supergroup"):
        if BOT_USERNAME in text:
            new_text = text.replace(BOT_USERNAME, "").strip()
            response = await asyncio.to_thread(handle_response, new_text)
        else:
            return
    else:
        response = await asyncio.to_thread(handle_response, text)

    print("Bot:", response)
    await update.message.reply_text(response)


async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Update {update} caused error {context.error}")