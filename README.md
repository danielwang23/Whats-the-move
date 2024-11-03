# Whats-the-move

## Inspiration

As UNC students, we often struggle to find events and feel truly connected to the UNC and local community. What The Move aims to solve this by providing a platform where users can easily discover UNC and local events, connect and chat with other attendees, and even host their own events. This is our inspiration for creating a more connected campus experience.

## What it does

Users can find personalized event recommendations based on their preferences. Once they match with an event, they can access detailed information and join a group chat to connect with other attendees. Unlike existing platforms like HeelLife or Eventbrite, What The Move also empowers users to host their own events, making it easier to bring people together.

## How we built it

Using a backend built with Python, Flask, and Node.js, we process user input and gather event information from local websites. To ensure the best event matches for each user, we leverage Hugging Face’s transformer NLP algorithm to analyze preferences. Finally, we bring everything together on the frontend using HTML, CSS, and the React.js framework.

## Challenges we ran into

Integrating the backend and frontend was a significant challenge, particularly when it came to retrieving data and saving user inputs. After countless hours of debugging and testing new solutions, we ultimately succeeded in bringing everything together seamlessly.

## Accomplishments that we're proud of

We are incredibly proud of our NLP recommendation algorithm, as well as the platform’s ability to enable users to connect with others and host their own community events.

## What we learned

We learned how to seamlessly integrate the frontend and backend, enhancing our skills in building a cohesive application. Additionally, we refined our frontend skills to design a visually appealing and user-friendly interface.

## What's next for What The Move?

We aim to grow our user base, as the app’s success relies on users coming together to interact. Additionally, we hope to expand our database to include events from more towns and schools, allowing our impact to reach beyond UNC and the Chapel Hill area.

## Technologies and Frameworks
Backend: We used Node.js, Python, and Flask to handle data processing on the backend. Python, along with libraries like Pandas, helped us parse data on local events, while Hugging Face’s transformer NLP package analyzed user preferences to recommend the most suitable attractions or events. Node.js, Flask, and Python worked together to manage data from the frontend and facilitate storage.

Frontend: For the frontend, we implemented HTML, CSS, and JavaScript, using React.js to design visually appealing and user-friendly interfaces. User input from the frontend was sent to the backend for storage or further analysis.

Generative AI Usage: We leveraged generative AI to assist with data cleaning, parsing, and implementing unfamiliar packages or frameworks. For instance, ChatGPT helped us convert calendar data from .ics to .csv to .json formats for analysis. Generative AI also guided us in implementing the NLP package from Hugging Face, a tool we were initially unfamiliar with. On the frontend, AI support helped with formatting, ensuring the website met our visual standards. When integrating the frontend and backend, we encountered deployment issues, but generative AI guided us through debugging and resolving error messages.
