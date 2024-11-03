import json
import re
from transformers import AutoTokenizer, AutoModel
import torch
from torch.nn.functional import cosine_similarity
from datetime import datetime
import pytz
import urllib.parse  # For URL encoding
from dateutil import parser  # For flexible date parsing

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

# Set timezone to Eastern Standard Time (EST)
EST = pytz.timezone("America/New_York")

# Data preparation functions
def preferences_to_text(preferences):
    return (
        f"Looking for {preferences['Activity']} on {preferences['Date']} at {preferences['Time']} "
        f"that lasts {preferences['Duration']} in {preferences['Location']} with a budget of ${preferences['Budget']}."
    )

def event_to_text(event):
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
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings

# Similarity function with activity weight
def compute_similarity(user_embedding, event_embedding, activity_match):
    base_similarity = cosine_similarity(user_embedding, event_embedding).item()
    return base_similarity + (0.5 if activity_match else 0)

# Function to remove ordinal suffixes from date strings
def remove_ordinal_suffix(date_str):
    return re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

# Date parsing function using dateutil
def parse_date(date_str):
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
        return None

# Recommendation function with adjustable date and time matching
def recommend_events(user_preferences, events_list, top_k=1, exclude_events=None, strict=True):
    if exclude_events is None:
        exclude_events = []

    user_text = preferences_to_text(user_preferences)
    user_embedding = encode(user_text)

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
            print(f"Warning: Unable to parse event date for '{event['Title']}'. Skipping event.")
            continue

        # Debug: Print parsed dates
        # print(f"User datetime: {user_datetime}, Event datetime: {event_datetime}")

        # Date and time check
        if strict:
            # Exact date match
            if event_datetime.date() != user_datetime.date():
                continue
            # Allow a time window, e.g., +/- 30 minutes
            time_difference = abs((event_datetime - user_datetime).total_seconds())
            if time_difference > 1800:  # 30 minutes in seconds
                continue
        else:
            # Calculate date difference in days
            date_difference = abs((event_datetime.date() - user_datetime.date()).days)
            # Allow events within 7 days
            if date_difference > 7:
                continue

        # Basic filtering on other criteria
        try:
            event_cost = float(event.get('Cost', 0))
        except ValueError:
            event_cost = 0.0
        try:
            user_budget = float(user_preferences.get('Budget', 0))
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
        )

        # Activity matching
        user_activity = user_preferences.get('Activity', '').lower()
        event_categories = (event.get('Categories') or '').lower()
        activity_match = user_activity in event_categories

        # Debug: Print matching criteria
        # print(f"Event: {event['Title']}, Location Match: {location_match}, Activity Match: {activity_match}")

        # Assign a basic match score
        match_score = 0
        if location_match:
            match_score += 1
        if activity_match:
            match_score += 1
        if not strict:
            # Adjust match score based on date difference
            match_score += max(0, 1 - (date_difference / 7))  # Events closer in date get higher score

        # Only consider events that match at least one preference
        if match_score > 0:
            matched_events.append((match_score, event, activity_match, event_datetime))

    return matched_events

# Function to find and recommend the best matching event
def find_best_event(matched_events, user_embedding, user_datetime, top_k=1):
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
        score = compute_similarity(user_embedding, event_embedding, activity_match)
        event_scores.append((score, event))

    # Sort by similarity score (descending) and return top events
    event_scores.sort(key=lambda x: x[0], reverse=True)
    return [event for score, event in event_scores[:top_k]]

# Helper function to generate Google Maps link for the building location
def generate_map_link(location):
    building_name = location.split(',')[0].strip()
    base_url = "https://www.google.com/maps/search/?api=1&query="
    query = urllib.parse.quote(building_name)
    return base_url + query

# Main function to interact with the user
def main():
    # Load user preferences from JSON file
    try:
        with open('user_preferences.json', 'r') as f:
            user_preferences = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("Error: Could not load 'user_preferences.json'.")
        return

    # Load events data from JSON file
    try:
        with open('events_converted_EST.json', 'r') as f:
            events_data = json.load(f)
            events_list = events_data if isinstance(events_data, list) else [events_data]
    except (FileNotFoundError, json.JSONDecodeError):
        print("Error: Could not load 'events_converted_EST.json'.")
        return

    exclude_events = []
    user_embedding = encode(preferences_to_text(user_preferences))

    while True:
        # Find strictly matching events by date and time
        matched_events = recommend_events(
            user_preferences,
            events_list,
            exclude_events=exclude_events,
            strict=True
        )

        if matched_events:
            # Get the best matching event
            user_datetime = parse_date(f"{user_preferences['Date']} {user_preferences['Time']}")
            recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=1)
            event = recommended_events[0]
            print(f"\nThis event '{event['Title']}' would best fit with your needs!")

            # Display event details
            print("\nEvent Details:")
            print(event_to_text(event))

            # Generate and display map link
            map_link = generate_map_link(event.get('Location', ''))
            print(f"\nYou can view the location here: {map_link}")

            # Ask for feedback and handle further action
            user_response = input("\nDo you want to proceed with this event? (yes/no): ").strip().lower()
            if user_response == 'yes':
                print("\nGreat! Enjoy your event!")
                break
            else:
                exclude_events.append(event)
                continue
        else:
            user_response = input("\nNo events match your exact date and time preferences. Would you consider other dates/times? (yes/no): ").strip().lower()
            if user_response == 'yes':
                matched_events = recommend_events(user_preferences, events_list, exclude_events=exclude_events, strict=False)
                if matched_events:
                    # Update user_datetime to the preferred date for sorting
                    user_datetime = parse_date(f"{user_preferences['Date']} {user_preferences['Time']}")
                    
                    recommended_events = find_best_event(matched_events, user_embedding, user_datetime, top_k=1)
                    event = recommended_events[0]
                    print(f"\nSuggested alternative event '{event['Title']}' on {event['Start Time']}.")

                    # Display event details
                    print("\nEvent Details:")
                    print(event_to_text(event))

                    # Generate and display map link
                    map_link = generate_map_link(event.get('Location', ''))
                    print(f"\nYou can view the location here: {map_link}")

                    user_response = input("\nDo you want to proceed with this alternative event? (yes/no): ").strip().lower()
                    if user_response == 'yes':
                        print("\nGreat! Enjoy your event!")
                        break
                    else:
                        exclude_events.append(event)
                        continue
                else:
                    print("\nNo alternative events found within the flexible date range.")
                    break
            else:
                print("\nNo events match your exact preferences.")
                break

if __name__ == "__main__":
    main()
