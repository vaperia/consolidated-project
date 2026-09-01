from flask import request, jsonify

from state import system_state
from hardware import set_window, set_door, set_light, set_fan


def register_routes(app):
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "state": system_state}), 200

    @app.route("/status", methods=["GET"])
    def status():
        return jsonify(system_state), 200

    @app.route("/window", methods=["POST"])
    def window_control():
        data = request.get_json(silent=True) or {}
        action = data.get("action")

        if action == "open":
            set_window(True)
        elif action == "close":
            set_window(False)
        else:
            return jsonify({"error": "Invalid action"}), 400

        return jsonify({"message": f"Window {action}d", "state": system_state}), 200

    @app.route("/door", methods=["POST"])
    def door_control():
        data = request.get_json(silent=True) or {}
        action = data.get("action")

        if action == "open":
            set_door(True)
        elif action == "close":
            set_door(False)
        else:
            return jsonify({"error": "Invalid action"}), 400

        return jsonify({"message": f"Door {action}d", "state": system_state}), 200

    @app.route("/light", methods=["POST"])
    def light_control():
        data = request.get_json(silent=True) or {}
        action = data.get("action")

        if action == "on":
            set_light(True)
        elif action == "off":
            set_light(False)
        else:
            return jsonify({"error": "Invalid action"}), 400

        return jsonify({"message": f"Light {action}", "state": system_state}), 200
    
    @app.route("/fan", methods=["POST"])
    def fan_control():
        data = request.get_json(silent=True) or {}
        action = data.get("action")

        if action == "on":
            set_fan(True)
        elif action == "off":
            set_fan(False)
        else:
            return jsonify({"error": "Invalid action"}), 400

        return jsonify({"message": f"Fan {action}", "state": system_state}), 200
