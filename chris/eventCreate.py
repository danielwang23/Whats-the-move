import json
from datetime import datetime

events_file_path = 'events.json'

def add_event(username, title, description, category, start_time, end_time, location, cost, on_off_campus, guid=None, link=None):
    if not all([username, title, description, category, start_time, end_time, location, cost]) or not isinstance(on_off_campus, bool):
        raise ValueError("All mandatory fields, including on/off campus status as a boolean, must be provided.")
    
    formatted_start_time = datetime.strptime(start_time, "%Y-%m-%d %H:%M").strftime("%m/%d/%y %H:%M")
    formatted_end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M").strftime("%m/%d/%y %H:%M")
    
    try:
        with open(events_file_path, 'r') as file:
            events = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        events = [] 

    new_event = {
        "Title": title,
        "GUID": guid,
        "Link": link,
        "Description": description,
        "Categories": category,
        "Start Time": formatted_start_time,
        "End Time": formatted_end_time,
        "Location": location,
        "Author": username,
        "Cost": cost,
        "On/Off Campus": on_off_campus,
        "Attendees": [username] 
    }

    events.append(new_event)

    with open(events_file_path, 'w') as file:
        json.dump(events, file, indent=4)

    print("Event added successfully.")

add_event(
    username="JohnDoe",
    title="Art Workshop",
    description="A workshop for beginner artists to explore watercolors.",
    category="Arts",
    start_time="2024-11-15 10:30",
    end_time="2024-11-15 12:30",
    location="Community Arts Center",
    cost=20,
    on_off_campus=True, 
    guid=None,
    link="https://example.com/workshop"
)
