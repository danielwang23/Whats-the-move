# whatsthemove1.py

import json
import re
from transformers import AutoTokenizer, AutoModel
import torch
from torch.nn.functional import cosine_similarity
from datetime import datetime
import pytz
import urllib.parse  # For URL encoding
from dateutil import parser  # For flexible date parsing
import os

# Load tokenizer and model
print("Loading tokenizer and model...")
try:
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
    print("Tokenizer and model loaded successfully.")
except Exception as e:
    print(f"Error loading tokenizer or model: {e}")
    raise e  # Re-raise exception after logging

# Set timezone to Eastern Standard Time (EST)
EST = pytz.timezone("America/New_York")

# Data preparation functions
def preferences_to_text(preferences):
    """
    Converts user preferences into a descriptive text.
    """
    return (
        f"Looking for {preferences['Activity']} on {preferences['Date']} at {preferences['Time']} "
        f"that lasts {preferences['Duration']} in {preferences['Location']} with a budget of ${preferences['Budget']}."
    )

def event_to_text(event):
    """
    Converts an event's details into descriptive text.
    """
    # Parse and convert Start Time and End Time to EST for display
    event_start = parse_date(event['Start Time'])
    event_end = parse_date(event.get('End Time', ''))

    if event_start:
        start_time_est = event_start.strftime("%a, %d %b %Y %I:%M %p %Z")
    else:
        start_time_est = "Unknown"

    if event_end:
        end_time_est = event_end.strftime("%I:%M %p %Z")
    else:
        end_time_est = "Unknown"

    return (
        f"{event['Title']} happening on {start_time_est} to {end_time_est} at {event['Location']}. "
        f"Categories: {event.get('Categories', '')}. Description: {event.get('Description', '')}. "
        f"Cost: ${event.get('Cost', 0)}."
    )

# Encoding function
def encode(text):
    """
    Encodes text into embeddings using a transformer model.
    """
    try:
        inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
        with torch.no_grad():
            embeddings = model(**inputs).last_hidden_state.mean(dim=1)
        return embeddings
    except Exception as e:
        print(f"Error encoding text: {e}")
        return None

# Similarity function with activity weight
def compute_similarity(user_embedding, event_embedding, activity_match):
    """
    Computes similarity between user and event embeddings, adjusting for activity match.
    """
    try:
        base_similarity = cosine_similarity(user_embedding, event_embedding).item()
        return base_similarity + (0.5 if activity_match else 0)
    except Exception as e:
        print(f"Error computing similarity: {e}")
        return 0

# Function to remove ordinal suffixes from date strings
def remove_ordinal_suffix(date_str):
    """
    Removes ordinal suffixes (st, nd, rd, th) from date strings.
    """
    return re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

# Date parsing function using dateutil
def parse_date(date_str):
    """
    Parses a date string into a datetime object localized to EST.
    """
    try:
        # Remove ordinal suffixes
        date_str = remove_ordinal_suffix(date_str)
        # Parse date using dateutil
        dt = parser.parse(date_str, fuzzy=True)
        # Convert to EST
        if dt.tzinfo is None:
            dt = EST.localize(dt)
        else:
            dt = dt.astimezone(EST)
        return dt
    except (ValueError, OverflowError) as e:
        print(f"Error parsing date '{date_str}': {e}")
        return None

# Recommendation function
def recommend_events(user_preferences, events_list, exclude_events=None, strict=True):
    """
    Recommends events based on user preferences.
    """
    if exclude_events is None:
        exclude_events = []

    user_text = preferences_to_text(user_preferences)
    user_embedding = encode(user_text)

    if user_embedding is None:
        print("Error: User embedding could not be generated.")
        return []

    # Combine user's preferred date and time for comparison
    user_datetime_str = f"{user_preferences['Date']} {user_preferences['Time']}"
    user_datetime = parse_date(user_datetime_str)

    if not user_datetime:
        print("Error: Unable to parse user date and time.")
        return []

    matched_events = []

    # Process each event for date and time match
    for event in events_list:
        if event in exclude_events:
            continue

        # Parse and convert event's date and time to EST
        event_datetime = parse_date(event['Start Time'])
        if event_datetime:
            event_datetime = event_datetime.astimezone(EST)
        if not event_datetime:
            print(f"Event '{event.get('Title', 'Unnamed Event')}' has invalid Start Time. Skipping.")
            continue

        # Date and time check
        date_match = event_datetime.date() == user_datetime.date()
        time_difference = abs((event_datetime - user_datetime).total_seconds())
        time_match = time_difference <= 1800  # 30 minutes

        if strict and not (date_match and time_match):
            continue

        # Basic filtering on other criteria
        try:
            event_cost = float(event.get('Cost', 0))
        except ValueError:
            event_cost = 0.0

        user_budget = user_preferences.get('Budget', 'Any')
        if user_budget != 'Any':
            try:
                user_budget = float(user_budget)
            except ValueError:
                user_budget = 0.0
            if event_cost > user_budget:
                continue

        # Ensure 'On/Off Campus' is a boolean
        event_on_campus = event.get('On/Off Campus', False)
        if isinstance(event_on_campus, str):
            event_on_campus = event_on_campus.lower() == 'true'

        location_preference = user_preferences['Location'].lower()
        location_match = (
            (location_preference == 'on campus' and event_on_campus)
            or (location_preference == 'off campus' and not event_on_campus)
            or (location_preference == 'both')
        )

        # Activity matching
        user_activities = [activity.strip().lower() for activity in user_preferences.get('Activity', '').split(',')]
        event_categories = (event.get('Categories') or '').lower()
        activity_match = any(activity in event_categories for activity in user_activities)

        # Assign a basic match score
        match_score = 0
        if location_match:
            match_score += 1
        if activity_match:
            match_score += 1

        # Only consider events that match at least one preference
        if match_score > 0:
            matched_events.append((match_score, event, activity_match, event_datetime))

    return matched_events

# Function to find and recommend the best matching event
def find_best_event(matched_events, user_embedding, user_datetime, top_k=1):
    """
    Selects the best matching events based on similarity scores.
    """
    if not matched_events:
        return []

    # Sort events by match score (descending) and then by date closeness
    matched_events.sort(key=lambda x: (-x[0], abs((x[3] - user_datetime).total_seconds())))

    # Get top_k events
    top_matches = matched_events[:top_k]

    # Score events by embedding similarity
    event_scores = []
    for match_score, event, activity_match, event_datetime in top_matches:
        event_text = event_to_text(event)
        event_embedding = encode(event_text)
        if event_embedding is None:
            print(f"Error: Could not encode event '{event.get('Title', 'Unnamed Event')}'. Skipping.")
            continue
        score = compute_similarity(user_embedding, event_embedding, activity_match)
        event_scores.append((score, event))

    # Sort by similarity score (descending) and return top events
    event_scores.sort(key=lambda x: x[0], reverse=True)
    return [event for score, event in event_scores[:top_k]]

# Helper function to generate Google Maps link for the building location
def generate_map_link(location):
    """
    Generates a Google Maps search link for a given location.
    """
    if not location:
        return ""
    building_name = location.split(',')[0].strip()
    base_url = "https://www.google.com/maps/search/?api=1&query="
    query = urllib.parse.quote(building_name)
    return base_url + query

# Main algorithm function
def main_algorithm(user_preferences, consider_alternatives=False, exclude_events=None):
    """
    Main function to recommend events based on user preferences.
    Returns a dictionary with either 'event' or 'message' keys.
    """
    if exclude_events is None:
        exclude_events = []

    # Determine the directory where the current script resides
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, 'events_converted_EST.json')
    print(f"Attempting to load events from: {json_path}")

    # Load events data from JSON file
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

    # Encode user preferences
    user_embedding = encode(preferences_to_text(user_preferences))

    if user_embedding is None:
        print("Error: User embedding could not be generated.")
        return {"message": "Error processing your preferences."}

    # First, try to find events that exactly match date and time
    matched_events = recommend_events(
        user_preferences,
        events_list,
        exclude_events=exclude_events,
        strict=True
    )

    # Parse user datetime
    user_datetime = parse_date(f"{user_preferences['Date']} {user_preferences['Time']}")

    if not user_datetime:
        print("Error: Unable to parse user date and time.")
        return {"message": "Error processing your date and time preferences."}

    if matched_events:
        recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=1)
        if recommended_events:
            event = recommended_events[0]
            event['Map Link'] = generate_map_link(event.get('Location', ''))
            event['alternative'] = False  # Indicate this is not an alternative suggestion
            print(f"Recommended Event: {event['Title']}")
            return {"event": event}
        else:
            return {"message": "No events match your preferences."}
    elif consider_alternatives:
        # Try to find events that are close in date and time
        matched_events = recommend_events(
            user_preferences,
            events_list,
            exclude_events=exclude_events,
            strict=False
        )
        if matched_events:
            recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=1)
            if recommended_events:
                event = recommended_events[0]
                event['Map Link'] = generate_map_link(event.get('Location', ''))
                event['alternative'] = True  # Indicate this is an alternative suggestion
                print(f"Alternative Recommended Event: {event['Title']}")
                return {"event": event}
            else:
                return {"message": "No events match your preferences."}
        else:
            return {"message": "No events match your preferences."}
    else:
        return {
            "message": "No events match your exact preferences.",
            "ask_for_alternatives": True
        }

if __name__ == "__main__":
    # Example Test Cases
    print("Running sample tests...\n")

    # Sample user preferences for exact match
    user_preferences_exact = {
        "Time": "6:30 PM",
        "Date": "November 17, 2024",
        "Activity": "music",
        "Duration": "2 hours",
        "Location": "on campus",
        "Budget": "20"
    }

    # Sample user preferences for alternative match
    user_preferences_alternative = {
        "Time": "6:30 PM",
        "Date": "November 19, 2024",
        "Activity": "music",
        "Duration": "2 hours",
        "Location": "on campus",
        "Budget": "20"
    }

    # Sample user preferences with no match
    user_preferences_no_match = {
        "Time": "9:00 PM",
        "Date": "December 25, 2024",
        "Activity": "dance",
        "Duration": "1 hour",
        "Location": "off campus",
        "Budget": "10"
    }

    print("Testing Exact Match:")
    result_exact = main_algorithm(user_preferences_exact)
    print(json.dumps(result_exact, indent=4))
    print("\n")

    print("Testing Alternative Match:")
    result_alternative = main_algorithm(user_preferences_alternative, consider_alternatives=True, exclude_events=[])
    print(json.dumps(result_alternative, indent=4))
    print("\n")

    print("Testing No Match:")
    result_no_match = main_algorithm(user_preferences_no_match)
    print(json.dumps(result_no_match, indent=4))
    print("\n")
