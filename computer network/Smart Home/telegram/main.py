import asyncio
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from config import TOKEN
from commands import (
    start_command, help_command, custom_command,
    menu_command, window_command,
    light_command, fan_command,
    door_command, temp_command,
    checkstate_command, weather_command,
    automode_command
)
from responses import handle_message, error
from doorbell import doorbell_loop
from weather import weather_loop
from notify_loop import notify_loop

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


def _make_task_with_restart(coro_fn, bot, name):
    async def runner():
        while True:
            try:
                await coro_fn(bot)
            except Exception as e:
                logger.error(f"[{name}] Crashed: {e} — restarting in 5s")
                await asyncio.sleep(5)
    return runner()


async def post_init(app):
    await app.bot.delete_webhook(drop_pending_updates=True)
    await asyncio.sleep(1)
    asyncio.create_task(_make_task_with_restart(doorbell_loop, app.bot, "Doorbell"))
    asyncio.create_task(_make_task_with_restart(weather_loop,  app.bot, "Weather"))
    asyncio.create_task(_make_task_with_restart(notify_loop,   app.bot, "NotifyLoop"))


if __name__ == '__main__':
    print('Starting bot...')
    app = Application.builder().token(TOKEN).post_init(post_init).build()

    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('custom', custom_command))
    app.add_handler(CommandHandler('menu', menu_command))

    app.add_handler(CommandHandler('window', window_command))
    app.add_handler(CommandHandler('light', light_command))
    app.add_handler(CommandHandler('fan', fan_command))
    app.add_handler(CommandHandler('door', door_command))
    app.add_handler(CommandHandler('temp', temp_command))
    app.add_handler(CommandHandler('checkstate', checkstate_command))
    app.add_handler(CommandHandler('weather', weather_command))
    app.add_handler(CommandHandler('automode', automode_command))

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_error_handler(error)

    print('Polling...')
    app.run_polling(
        poll_interval=3,
        drop_pending_updates=True,
        allowed_updates=Update.ALL_TYPES,
    )