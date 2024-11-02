import re
import pandas as pd

ics_file_path = "the-triangle-weekender-167abfe8b6a.ics"

def extract_address(location):
    address_pattern = re.compile(r"(?P<address>[\d\s\w]+),\s*(?P<city>[\w\s]+),\s*(?P<state>[A-Z]{2})\s*(?P<zip>\d{5})")
    match = address_pattern.search(location)
    if match:
        return match.group("address"), match.group("city"), match.group("state"), match.group("zip")
    return None, None, None, None

def extract_cost_numeric(description):
    if "free" in description.lower():
        return 0

    cost_match = re.search(r"\$(\d+(?:\.\d{2})?)", description)
    if cost_match:
        return float(cost_match.group(1))

    return 0

with open(ics_file_path, 'r') as file:
    lines = file.readlines()

events = []
current_event = {}
is_description_continued = False

for line in lines:
    line = line.strip()
    
    if line == "BEGIN:VEVENT":
        current_event = {}
    elif line == "END:VEVENT":
        events.append(current_event)

    elif line.startswith("SUMMARY:"):
        current_event["Event Name"] = line.replace("SUMMARY:", "").strip()
    elif line.startswith("DTSTART;"):
        start_match = re.search(r"DTSTART(;[^:]+)?:([0-9T]+)", line)
        if start_match:
            current_event["Start Time"] = start_match.group(2)
    elif line.startswith("DTEND;"):
        end_match = re.search(r"DTEND(;[^:]+)?:([0-9T]+)", line)
        if end_match:
            current_event["End Time"] = end_match.group(2)
    elif line.startswith("DESCRIPTION:"):
        description = line.replace("DESCRIPTION:", "").strip()
        current_event["Description"] = description
        is_description_continued = True
    elif is_description_continued and not line.startswith(" "): 
        is_description_continued = False
    elif is_description_continued:
        current_event["Description"] += " " + line.strip()
    elif line.startswith("LOCATION:"):
        current_event["Location"] = line.replace("LOCATION:", "").strip()
    elif line.startswith("CATEGORIES:"):
        current_event["Category"] = line.replace("CATEGORIES:", "").strip()
    elif line.startswith("ORGANIZER;"):
        organizer_match = re.search(r'CN="([^"]+)', line)
        if organizer_match:
            current_event["Organizer"] = organizer_match.group(1)
    elif line.startswith("URL:"):
        current_event["URL"] = line.replace("URL:", "").strip()

events_df = pd.DataFrame(events)

events_df["Start Time"] = pd.to_datetime(events_df["Start Time"], errors='coerce').dt.strftime('%Y-%m-%d %H:%M:%S')
events_df["End Time"] = pd.to_datetime(events_df["End Time"], errors='coerce').dt.strftime('%Y-%m-%d %H:%M:%S')
events_df["Date"] = pd.to_datetime(events_df["Start Time"], errors='coerce').dt.strftime('%Y-%m-%d')

events_df["Street Address"], events_df["City"], events_df["State"], events_df["Zip Code"] = zip(
    *events_df["Location"].apply(lambda loc: extract_address(loc) if isinstance(loc, str) else (None, None, None, None))
)

events_df["Cost"] = events_df["Description"].apply(lambda desc: extract_cost_numeric(desc) if isinstance(desc, str) else 0)

events_df.drop(columns=["Location"], inplace=True)

csv_path = "triangle_weekender_events_with_address_and_cost.csv"
events_df.to_csv(csv_path, index=False)

csv_path
