from flask import Flask, request, jsonify
import json
import os
from datetime import datetime
from WhatsTheMove1 import main_algorithm
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Constants
DATA_DIR = 'data'
USER_DATA_FILE = 'user_data.json'
USER_DATA_PATH = os.path.join(DATA_DIR, USER_DATA_FILE)

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def init_data_file():
    """Initialize the data file if it doesn't exist"""
    if not os.path.exists(USER_DATA_PATH):
        with open(USER_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump([], f)

def load_user_data():
    """Load all user data from file"""
    try:
        with open(USER_DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        init_data_file()
        return []
    except json.JSONDecodeError:
        # If file is corrupted, backup and start fresh
        backup_file = f"{USER_DATA_PATH}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.rename(USER_DATA_PATH, backup_file)
        init_data_file()
        return []

def save_user_data(session_id, preferences, event, action):
    """Save user data to file with error handling and atomic writes"""
    try:
        # Load existing data
        all_user_data = load_user_data()
        
        # Create new entry
        new_entry = {
            "session_id": session_id,
            "preferences": preferences,
            "event": event,
            "action": action,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        all_user_data.append(new_entry)
        
        # Write to temporary file first
        temp_file = f"{USER_DATA_PATH}.temp"
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(all_user_data, f, indent=2, ensure_ascii=False)
        
        # Atomic replace
        os.replace(temp_file, USER_DATA_PATH)
        
        return True
    except Exception as e:
        print(f"Error saving user data: {e}")
        return False

# In-memory session storage
user_sessions = {}

@app.route('/run-algorithm', methods=['POST'])
def run_algorithm_route():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON format."}), 400

        session_id = data.get('session_id')
        action = data.get('action', 'start')
        preferences = data.get('preferences', {})

        if not session_id:
            return jsonify({"error": "Session ID is required."}), 400

        # Initialize or get session
        session = user_sessions.setdefault(session_id, {
            'preferences': preferences,
            'exclude_events': [],
            'last_event': None
        })

        result = None
        
        if action == 'start':
            result = main_algorithm(preferences)
            if 'event' in result:
                session['last_event'] = result['event']
                save_user_data(session_id, preferences, result['event'], action)
                
        elif action == 'reject':
            last_event = session.get('last_event')
            if last_event:
                session['exclude_events'].append(last_event)
            result = main_algorithm(
                preferences, 
                consider_alternatives=True, 
                exclude_events=session['exclude_events']
            )
            if 'event' in result:
                session['last_event'] = result['event']
                save_user_data(session_id, preferences, result['event'], action)
                
        elif action == 'accept':
            last_event = session.get('last_event')
            if last_event:
                save_user_data(session_id, preferences, last_event, action)
                result = {"message": "Enjoy your event!", "event": last_event}
            else:
                return jsonify({"error": "No event to accept."}), 400

        if result:
            return jsonify(result), 200
        else:
            return jsonify({"error": "No suitable events found."}), 404

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    init_data_file()
    app.run(debug=True, use_reloader=False)