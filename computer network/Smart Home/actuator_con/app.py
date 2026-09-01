from flask import Flask

from config import FLASK_HOST, FLASK_PORT
from routes import register_routes
from hardware import cleanup

app = Flask(__name__)
register_routes(app)

if __name__ == "__main__":
    try:
        app.run(host=FLASK_HOST, port=FLASK_PORT, debug=False)
    finally:
        cleanup()
