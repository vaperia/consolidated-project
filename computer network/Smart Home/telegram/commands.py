import asyncio
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import ContextTypes
import requests
from datetime import datetime

from config import BASE_API
from auth import restricted


# ── Device locks (prevents race conditions on simultaneous toggles) ────────────

_device_locks = {
    "fan":    asyncio.Lock(),
    "light":  asyncio.Lock(),
    "window": asyncio.Lock(),
    "door":   asyncio.Lock(),
}


# ── Backend helpers ────────────────────────────────────────────────────────────

def get_backend_state() -> dict:
    r = requests.get(f"{BASE_API}/api/full-state", timeout=10)
    r.raise_for_status()
    return r.json()


def get_auto_states() -> dict:
    """Returns all four automation flags from the backend state."""
    try:
        r = requests.get(f"{BASE_API}/api/state", timeout=10)
        r.raise_for_status()
        data = r.json()
        return {
            "master": bool(data.get("automation_enabled",    False)),
            "fan":    bool(data.get("fan_auto_enabled",      False)),
            "window": bool(data.get("window_auto_enabled",   False)),
            "light":  bool(data.get("light_auto_enabled",    False)),
        }
    except Exception:
        return {"master": False, "fan": False, "window": False, "light": False}


def post_backend(path: str) -> dict:
    r = requests.post(f"{BASE_API}{path}", timeout=10)
    r.raise_for_status()
    return r.json()


# ── Keyboards ──────────────────────────────────────────────────────────────────

def main_menu_keyboard():
    return ReplyKeyboardMarkup(
        [
            [KeyboardButton("🪟 Windows"),    KeyboardButton("💡 Light")],
            [KeyboardButton("🌀 Fan"),         KeyboardButton("🚪 Door")],
            [KeyboardButton("📊 Check State"), KeyboardButton("🌡 Temp")],
            [KeyboardButton("🌧 Weather"),     KeyboardButton("🤖 Auto Mode")],
        ],
        resize_keyboard=True,
        is_persistent=True,
    )


def auto_mode_keyboard(auto: dict):
    """Submenu showing live ON/OFF status on each button."""
    def lbl(name: str, state: bool) -> str:
        return f"{name} {'ON 🟢' if state else 'OFF 🔴'}"

    return ReplyKeyboardMarkup(
        [
            [KeyboardButton(lbl("🤖 Master Auto", auto["master"]))],
            [KeyboardButton(lbl("🌀 Fan Auto",    auto["fan"]))],
            [KeyboardButton(lbl("🪟 Window Auto", auto["window"]))],
            [KeyboardButton(lbl("💡 Light Auto",  auto["light"]))],
            [KeyboardButton("🔙 Back")],
        ],
        resize_keyboard=True,
        is_persistent=True,
    )


# ── State formatting ───────────────────────────────────────────────────────────

def format_state(states: dict, auto: dict) -> str:
    return (
        "🏠 *Current Device States*\n"
        "───────────────────\n"
        f"🤖 Master Auto: {'ON 🟢' if auto['master'] else 'OFF 🔴'}\n"
        f"   🌀 Fan Auto: {'ON 🟢' if auto['fan']    else 'OFF 🔴'}\n"
        f"   🪟 Win Auto: {'ON 🟢' if auto['window'] else 'OFF 🔴'}\n"
        f"   💡 Lgt Auto: {'ON 🟢' if auto['light']  else 'OFF 🔴'}\n"
        "───────────────────\n"
        f"🪟 Windows: {states.get('window1', '--')}\n"
        f"🚪 Door: {states.get('door', '--')}\n"
        f"💡 Light: {'ON 💡' if states.get('light') else 'OFF'}\n"
        f"🌀 Fan: {states.get('fan', '--')}\n"
        f"🌡 Temperature: {states.get('temperature_c') or '--'} °C\n"
        f"🚶 Motion: {'detected' if states.get('motion') else 'no motion'}\n"
        f"⏱ Last Updated: {states.get('last_updated', '--')}\n"
    )


# ── General ────────────────────────────────────────────────────────────────────

@restricted
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Hello! Thanks for chatting with me! I am your homie!\n"
        "I am now linked to the smart home backend.\n\n"
        "Use the buttons below or type a command:",
        reply_markup=main_menu_keyboard(),
    )


@restricted
async def menu_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🏠 *Smart Home Controls*\nChoose an option:",
        parse_mode="Markdown",
        reply_markup=main_menu_keyboard(),
    )


@restricted
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Available commands:\n"
        "/menu - Show control buttons\n"
        "/checkstate - Check all device states\n"
        "/window - Toggle windows\n"
        "/light - Toggle light\n"
        "/fan - Toggle fan\n"
        "/door - Toggle door\n"
        "/temp - Check temperature & motion\n"
        "/weather - Check current weather forecast\n"
        "/automode - Open automation controls"
    )


@restricted
async def custom_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("im still a work in progress")


# ── Window ─────────────────────────────────────────────────────────────────────

@restricted
async def window_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with _device_locks["window"]:
        try:
            states = await asyncio.to_thread(get_backend_state)
            if states.get("window1") == "open":
                await asyncio.to_thread(post_backend, "/api/window/1/close")
                action = "closed 🪟"
            else:
                await asyncio.to_thread(post_backend, "/api/window/1/open")
                action = "opened 🪟"
            await update.message.reply_text(f"Windows {action}")
        except Exception:
            await update.message.reply_text("Failed to toggle windows.")


# ── Light ──────────────────────────────────────────────────────────────────────

@restricted
async def light_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with _device_locks["light"]:
        try:
            states = await asyncio.to_thread(get_backend_state)
            if states.get("light"):
                await asyncio.to_thread(post_backend, "/api/light/off")
                action = "turned OFF 💡"
            else:
                await asyncio.to_thread(post_backend, "/api/light/on")
                action = "turned ON 💡"
            await update.message.reply_text(f"Light {action}")
        except Exception:
            await update.message.reply_text("Failed to toggle light.")


# ── Fan ────────────────────────────────────────────────────────────────────────

@restricted
async def fan_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with _device_locks["fan"]:
        try:
            states = await asyncio.to_thread(get_backend_state)
            if states.get("fan") == "on":
                await asyncio.to_thread(post_backend, "/api/fan/off")
                action = "turned OFF 🌀"
            else:
                await asyncio.to_thread(post_backend, "/api/fan/on")
                action = "turned ON 🌀"
            await update.message.reply_text(f"Fan {action}")
        except Exception:
            await update.message.reply_text("Failed to toggle fan.")


# ── Door ───────────────────────────────────────────────────────────────────────

@restricted
async def door_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with _device_locks["door"]:
        try:
            states = await asyncio.to_thread(get_backend_state)
            if states.get("door") == "open":
                await asyncio.to_thread(post_backend, "/api/door/close")
                action = "closed 🚪"
            else:
                await asyncio.to_thread(post_backend, "/api/door/open")
                action = "opened 🚪"
            await update.message.reply_text(f"Door {action}")
        except Exception:
            await update.message.reply_text("Failed to toggle door.")


# ── Temperature ────────────────────────────────────────────────────────────────

@restricted
async def temp_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        states = await asyncio.to_thread(get_backend_state)
        await update.message.reply_text(
            f"🌡 Temperature: {states.get('temperature_c') or '--'} °C\n"
            f"🚶 Motion: {'detected' if states.get('motion') else 'no motion'}",
        )
    except Exception:
        await update.message.reply_text("Failed to fetch temperature.")


# ── Check State ────────────────────────────────────────────────────────────────

@restricted
async def checkstate_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        states = await asyncio.to_thread(get_backend_state)
        auto = get_auto_states()
        await update.message.reply_text(
            format_state(states, auto),
            parse_mode="Markdown",
        )
    except Exception:
        await update.message.reply_text("Failed to fetch state.")


# ── Weather ────────────────────────────────────────────────────────────────────

@restricted
async def weather_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    from weather import get_forecast, get_weather_emoji, AREA
    try:
        forecast = await asyncio.to_thread(get_forecast)
        emoji = get_weather_emoji(forecast)
        now = datetime.now()
        await update.message.reply_text(
            f"{emoji} *{AREA} Weather Forecast*\n"
            f"────────────────────\n"
            f"📋 {forecast}\n"
            f"⏱ {now.strftime('%d %b %Y, %I:%M %p')}",
            parse_mode="Markdown",
        )
    except Exception:
        await update.message.reply_text("Failed to fetch weather.")


# ── Auto Mode — opens submenu ──────────────────────────────────────────────────

@restricted
async def automode_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        auto = await asyncio.to_thread(get_auto_states)
        await update.message.reply_text(
            "🤖 *Automation Controls*\n"
            "───────────────────\n"
            "Tap a toggle to switch it on or off.\n"
            "Master turns all three on or off at once.",
            parse_mode="Markdown",
            reply_markup=auto_mode_keyboard(auto),
        )
    except Exception:
        await update.message.reply_text("Failed to open auto mode menu.")


# ── Auto Mode — toggle handlers ────────────────────────────────────────────────

@restricted
async def toggle_master_auto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Master ON → enables all 3. Master OFF → disables all 3."""
    try:
        auto = await asyncio.to_thread(get_auto_states)
        turning_on = not auto["master"]

        if turning_on:
            await asyncio.to_thread(post_backend, "/api/automation/enable")
            await asyncio.to_thread(post_backend, "/api/automation/fan/enable")
            await asyncio.to_thread(post_backend, "/api/automation/window/enable")
            await asyncio.to_thread(post_backend, "/api/automation/light/enable")
            msg = "🤖 Master Auto ON 🟢\n🌀 Fan Auto ON 🟢\n🪟 Window Auto ON 🟢\n💡 Light Auto ON 🟢"
        else:
            await asyncio.to_thread(post_backend, "/api/automation/disable")
            await asyncio.to_thread(post_backend, "/api/automation/fan/disable")
            await asyncio.to_thread(post_backend, "/api/automation/window/disable")
            await asyncio.to_thread(post_backend, "/api/automation/light/disable")
            msg = "🤖 Master Auto OFF 🔴\n🌀 Fan Auto OFF 🔴\n🪟 Window Auto OFF 🔴\n💡 Light Auto OFF 🔴"

        auto = await asyncio.to_thread(get_auto_states)
        await update.message.reply_text(msg, reply_markup=auto_mode_keyboard(auto))
    except Exception:
        await update.message.reply_text("Failed to toggle master auto.")


@restricted
async def toggle_fan_auto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Toggle fan auto independently.
    Master turns ON only if all three sub-autos are on.
    Master turns OFF if any sub-auto is off.
    """
    try:
        auto = await asyncio.to_thread(get_auto_states)
        turning_on = not auto["fan"]

        if turning_on:
            await asyncio.to_thread(post_backend, "/api/automation/fan/enable")
            # Enable master only if the other two are already on
            if auto["window"] and auto["light"]:
                await asyncio.to_thread(post_backend, "/api/automation/enable")
                msg = "🌀 Fan Auto ON 🟢\n🤖 Master Auto ON 🟢 (all enabled)"
            else:
                msg = "🌀 Fan Auto ON 🟢"
        else:
            await asyncio.to_thread(post_backend, "/api/automation/fan/disable")
            await asyncio.to_thread(post_backend, "/api/automation/disable")
            msg = "🌀 Fan Auto OFF 🔴\n🤖 Master Auto OFF 🔴"

        auto = await asyncio.to_thread(get_auto_states)
        await update.message.reply_text(msg, reply_markup=auto_mode_keyboard(auto))
    except Exception:
        await update.message.reply_text("Failed to toggle fan auto.")


@restricted
async def toggle_window_auto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Toggle window auto independently.
    Master turns ON only if all three sub-autos are on.
    Master turns OFF if any sub-auto is off.
    """
    try:
        auto = await asyncio.to_thread(get_auto_states)
        turning_on = not auto["window"]

        if turning_on:
            await asyncio.to_thread(post_backend, "/api/automation/window/enable")
            # Enable master only if the other two are already on
            if auto["fan"] and auto["light"]:
                await asyncio.to_thread(post_backend, "/api/automation/enable")
                msg = "🪟 Window Auto ON 🟢\n🤖 Master Auto ON 🟢 (all enabled)"
            else:
                msg = "🪟 Window Auto ON 🟢"
        else:
            await asyncio.to_thread(post_backend, "/api/automation/window/disable")
            await asyncio.to_thread(post_backend, "/api/automation/disable")
            msg = "🪟 Window Auto OFF 🔴\n🤖 Master Auto OFF 🔴"

        auto = await asyncio.to_thread(get_auto_states)
        await update.message.reply_text(msg, reply_markup=auto_mode_keyboard(auto))
    except Exception:
        await update.message.reply_text("Failed to toggle window auto.")


@restricted
async def toggle_light_auto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Toggle light auto independently.
    Master turns ON only if all three sub-autos are on.
    Master turns OFF if any sub-auto is off.
    """
    try:
        auto = await asyncio.to_thread(get_auto_states)
        turning_on = not auto["light"]

        if turning_on:
            await asyncio.to_thread(post_backend, "/api/automation/light/enable")
            # Enable master only if the other two are already on
            if auto["fan"] and auto["window"]:
                await asyncio.to_thread(post_backend, "/api/automation/enable")
                msg = "💡 Light Auto ON 🟢\n🤖 Master Auto ON 🟢 (all enabled)"
            else:
                msg = "💡 Light Auto ON 🟢"
        else:
            await asyncio.to_thread(post_backend, "/api/automation/light/disable")
            await asyncio.to_thread(post_backend, "/api/automation/disable")
            msg = "💡 Light Auto OFF 🔴\n🤖 Master Auto OFF 🔴"

        auto = await asyncio.to_thread(get_auto_states)
        await update.message.reply_text(msg, reply_markup=auto_mode_keyboard(auto))
    except Exception:
        await update.message.reply_text("Failed to toggle light auto.")