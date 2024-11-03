import json
import re
from transformers import AutoTokenizer, AutoModel
import torch
from torch.nn.functional import cosine_similarity
from datetime import datetime
import pytz
import urllib.parse
from dateutil import parser
import os
import random


print("Loading tokenizer and model...")
try:
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
    print("Tokenizer and model loaded successfully.")
except Exception as e:
    print(f"Error loading tokenizer or model: {e}")
    raise e

# Set timezone to Eastern Standard Time (EST)
EST = pytz.timezone("America/New_York")

# Sample predefined coordinates for known locations which we will add more if we knew
location_coordinates = {
    "Student Union": [35.9106, -79.0478],
    "Hanes Hall": [35.9100, -79.0500],
    "Graham Student Union": [35.9090, -79.0510],
    
}

def preferences_to_text(preferences):
    return (
        f"Looking for {preferences['Activity']} on {preferences['Date']} at {preferences['Time']} "
        f"that lasts {preferences['Duration']} in {preferences['Location']} with a budget of ${preferences['Budget']}."
    )

def event_to_text(event):
    event_start = parse_date(event['Start Time'])
    event_end = parse_date(event.get('End Time', ''))
    start_time_est = event_start.strftime("%a, %d %b %Y %I:%M %p %Z") if event_start else "Unknown"
    end_time_est = event_end.strftime("%I:%M %p %Z") if event_end else "Unknown"
    return (
        f"{event['Title']} happening on {start_time_est} to {end_time_est} at {event['Location']}. "
        f"Categories: {event.get('Categories', '')}. Description: {event.get('Description', '')}. "
        f"Cost: ${event.get('Cost', 0)}."
    )

def encode(text):
    try:
        inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
        with torch.no_grad():
            embeddings = model(**inputs).last_hidden_state.mean(dim=1)
        return embeddings
    except Exception as e:
        print(f"Error encoding text: {e}")
        return None

def compute_similarity(user_embedding, event_embedding, activity_match):
    try:
        base_similarity = cosine_similarity(user_embedding, event_embedding).item()
        return base_similarity + (0.5 if activity_match else 0)
    except Exception as e:
        print(f"Error computing similarity: {e}")
        return 0

def remove_ordinal_suffix(date_str):
    return re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

def parse_date(date_str):
    try:
        date_str = remove_ordinal_suffix(date_str)
        dt = parser.parse(date_str, fuzzy=True)
        return EST.localize(dt) if dt.tzinfo is None else dt.astimezone(EST)
    except (ValueError, OverflowError) as e:
        print(f"Error parsing date '{date_str}': {e}")
        return None

def recommend_events(user_preferences, events_list, exclude_events=None, strict=True):
    if exclude_events is None:
        exclude_events = []
    user_text = preferences_to_text(user_preferences)
    user_embedding = encode(user_text)
    if user_embedding is None:
        print("Error: User embedding could not be generated.")
        return []
    user_datetime_str = f"{user_preferences['Date']} {user_preferences['Time']}"
    user_datetime = parse_date(user_datetime_str)
    if not user_datetime:
        print("Error: Unable to parse user date and time.")
        return []
    matched_events = []
    for event in events_list:
        if event in exclude_events:
            continue
        event_datetime = parse_date(event['Start Time'])
        if not event_datetime:
            continue
        date_match = event_datetime.date() == user_datetime.date()
        time_difference = abs((event_datetime - user_datetime).total_seconds())
        time_match = time_difference <= 1800
        if strict and not (date_match and time_match):
            continue
        event_cost = float(event.get('Cost', 0))
        user_budget = float(user_preferences.get('Budget', 0)) if user_preferences.get('Budget') != 'Any' else float('inf')
        if event_cost > user_budget:
            continue
        event_on_campus = event.get('On/Off Campus', False) in ['True', True]
        location_preference = user_preferences['Location'].lower()
        location_match = (
            (location_preference == 'on campus' and event_on_campus)
            or (location_preference == 'off campus' and not event_on_campus)
            or (location_preference == 'both')
        )
        user_activities = [activity.strip().lower() for activity in user_preferences.get('Activity', [])]
        event_categories = (event.get('Categories') or '').lower()
        activity_match = any(activity in event_categories for activity in user_activities)
        match_score = 1 if location_match else 0
        match_score += 1 if activity_match else 0
        if match_score > 0:
            matched_events.append((match_score, event, activity_match, event_datetime))
    return matched_events

def find_best_event(matched_events, user_embedding, user_datetime, top_k=10):
    if not matched_events:
        return []
    matched_events.sort(key=lambda x: (-x[0], abs((x[3] - user_datetime).total_seconds())))
    top_matches = matched_events[:top_k]
    event_scores = []
    for match_score, event, activity_match, event_datetime in top_matches:
        event_text = event_to_text(event)
        event_embedding = encode(event_text)
        if event_embedding is None:
            continue
        score = compute_similarity(user_embedding, event_embedding, activity_match)
        event_scores.append((score, event))
    event_scores.sort(key=lambda x: x[0], reverse=True)
    return [event for score, event in event_scores[:top_k]]

def get_coordinates(location_name):
    if location_name in location_coordinates:
        return location_coordinates[location_name]
    else:
        
        central_lat, central_long = 35.9100, -79.0473
        random_lat = central_lat + random.uniform(-0.0015, 0.0015)
        random_long = central_long + random.uniform(-0.0015, 0.0015)
        return [random_lat, random_long]

def save_to_js_file(events, file_path="eventLocationsNEW.js"):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    target_path = os.path.join(current_dir, "unc-event-map", "data", file_path)
    js_content = "const eventLocations = [\n"
    for event in events:
        name = event['Title']
        coordinates = get_coordinates(event['Location'])
        description = event.get('Description', '').strip().replace("\n", "\\n").replace("\"", "\\\"")
        categories = event.get('Categories', '').split(", ")
        address = event.get('Location', 'UNC Campus')
        start_date = event.get('Start Time', '').split(" ")[0]
        end_date = event.get('End Time', '').split(" ")[0] if 'End Time' in event else start_date
        js_content += f"""  {{ 
      name: "{name}", 
      coordinates: {coordinates}, 
      description: "{description}",
      categories: {json.dumps(categories)},
      address: "{address}",
      startDate: "{start_date}",
      endDate: "{end_date}"
  }},
"""
    js_content += "];\n\nexport default eventLocations;"
    with open(file_path, "w") as file:
        file.write(js_content)
    print(f"Saved event locations to {file_path}")

def main_algorithm(user_preferences, consider_alternatives=True, exclude_events=None):
    if exclude_events is None:
        exclude_events = []
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, 'events_converted_EST.json')
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            events_data = json.load(f)
            events_list = events_data if isinstance(events_data, list) else [events_data]
        print(f"Successfully loaded {len(events_list)} events.")
    except FileNotFoundError as e:
        print(f"Error: 'events_converted_EST.json' not found at {json_path}. {e}")
        return {"message": "Error loading events data."}
    except json.JSONDecodeError as e:
        print(f"Error: JSON decode error in 'events_converted_EST.json'. {e}")
        return {"message": "Error loading events data."}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"message": "Error loading events data."}
    user_embedding = encode(preferences_to_text(user_preferences))
    if user_embedding is None:
        print("Error: User embedding could not be generated.")
        return {"message": "Error processing your preferences."}
    matched_events = recommend_events(
        user_preferences,
        events_list,
        exclude_events=exclude_events,
        strict=True
    )
    user_datetime = parse_date(f"{user_preferences['Date']} {user_preferences['Time']}")
    if not user_datetime:
        print("Error: Unable to parse user date and time.")
        return {"message": "Error processing your date and time preferences."}
    if matched_events:
        recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=10)
        for event in recommended_events:
            event['Map Link'] = generate_map_link(event.get('Location', ''))
            event['alternative'] = False
        return {"events": recommended_events}
    elif consider_alternatives:
        matched_events = recommend_events(
            user_preferences,
            events_list,
            exclude_events=exclude_events,
            strict=False
        )
        if matched_events:
            recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=10)
            return {"events": recommended_events}
        else:
            return {"message": "No events match your preferences."}
    else:
        return {
            "message": "No events match your exact preferences.",
            "ask_for_alternatives": True
        }

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    responses_path = os.path.join(current_dir, 'responses.json')
    try:
        with open(responses_path, 'r', encoding='utf-8') as f:
            responses_data = json.load(f)
            user_preferences_exact = responses_data[-1]
    except FileNotFoundError:
        user_preferences_exact = {}
    except json.JSONDecodeError as e:
        user_preferences_exact = {}
    print("Running sample tests...\n")
    result_exact = main_algorithm(user_preferences_exact)
    events_to_save = result_exact.get("events", [])
    save_to_js_file(events_to_save)
