from functools import wraps
from telegram import Update
from telegram.ext import ContextTypes
from config import ALLOWED_USERS

def restricted(func):
    @wraps(func)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user_id = update.effective_user.id
        if user_id not in ALLOWED_USERS:
            await update.message.reply_text('⛔ Unauthorised. You do not have access to this bot.')
            print(f'[AUTH] Blocked user {user_id} from {func.__name__}')
            return
        return await func(update, context, *args, **kwargs)
    return wrapper