// App.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Map from './components/Map';
import './App.css';
import CoverPage from './components/CoverPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import Question1Page from './components/Question1Page';
import Question2Page from './components/Question2Page';
import Question3Page from './components/Question3Page';
import Question4Page from './components/Question4Page';
import Question5Page from './components/Question5Page';
import YourEventsPage from './components/YourEventsPage';
import CreateEventsPage from './components/CreateEventsPage';

// Import the events data
import eventsData from './data/events.json'; // Adjust the path based on your project structure

function App() {
  const [currentPage, setCurrentPage] = useState('cover');
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [excludedEvents, setExcludedEvents] = useState([]);
  const [acceptedEvents, setAcceptedEvents] = useState([]);

  // Initialize session ID when app loads
  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const [preferences, setPreferences] = useState({
    Time: '',
    Date: '',
    Activity: '',
    Duration: '',
    Location: '',
    Budget: '',
  });

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogin = (name) => {
    setUsername(name);
    navigateTo('account');
  };

  // Function to filter events based on preferences
  const filterEvents = (preferences, excludeEvents = []) => {
    // Filter events that match the user's preferences and are not in the excludedEvents list
    let matchingEvents = eventsData.filter((event) => {
      // Check each preference
      for (let key in preferences) {
        if (preferences[key] && event[key] !== preferences[key]) {
          return false;
        }
      }
      // Exclude events that have been rejected
      return !excludeEvents.includes(event);
    });

    return matchingEvents;
  };

  // Function to handle saving preferences and getting recommendations
  const handlePreferenceSubmit = () => {
    const matchingEvents = filterEvents(preferences, excludedEvents);
    if (matchingEvents.length > 0) {
      setCurrentEvent(matchingEvents[0]); // Show the first matching event
      navigateTo('map');
    } else {
      alert('No suitable events found.');
      navigateTo('account');
    }
  };

  // Function to handle event acceptance/rejection
  const handleEventResponse = (accepted) => {
    if (accepted) {
      setAcceptedEvents([...acceptedEvents, currentEvent]);
      navigateTo('yourEvents');
    } else {
      setExcludedEvents([...excludedEvents, currentEvent]);
      // Find the next matching event
      const matchingEvents = filterEvents(preferences, excludedEvents.concat(currentEvent));
      if (matchingEvents.length > 0) {
        setCurrentEvent(matchingEvents[0]);
      } else {
        alert('No more events to show.');
        navigateTo('account');
      }
    }
  };

  return (
    <div className="App">
      {currentPage === 'cover' && <CoverPage onNext={() => navigateTo('login')} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'account' && (
        <AccountPage 
          username={username} 
          onNavigate={navigateTo} 
        />
      )}

      {currentPage === 'findEvents' && (
        <Question1Page
          preferences={preferences}
          setPreferences={setPreferences}
          onNext={() => navigateTo('question2')}
        />
      )}
      {currentPage === 'question2' && (
        <Question2Page
          preferences={preferences}
          setPreferences={setPreferences}
          onNext={() => navigateTo('question3')}
        />
      )}
      {currentPage === 'question3' && (
        <Question3Page
          preferences={preferences}
          setPreferences={setPreferences}
          onNext={() => navigateTo('question4')}
        />
      )}
      {currentPage === 'question4' && (
        <Question4Page
          preferences={preferences}
          setPreferences={setPreferences}
          onNext={() => navigateTo('question5')}
        />
      )}
      {currentPage === 'question5' && (
        <Question5Page
          preferences={preferences}
          setPreferences={setPreferences}
          onNext={() => {
            handlePreferenceSubmit(); // Filter events and show recommendations
          }}
        />
      )}

      {currentPage === 'map' && (
        <Map 
          event={currentEvent}
          onAccept={() => handleEventResponse(true)}
          onReject={() => handleEventResponse(false)}
          onBack={() => navigateTo('account')}
        />
      )}
      
      {currentPage === 'yourEvents' && (
        <YourEventsPage 
          events={acceptedEvents}
          onBack={() => navigateTo('account')} 
        />
      )}
      
      {currentPage === 'createEvents' && (
        <CreateEventsPage 
          onBack={() => navigateTo('account')} 
        />
      )}
    </div>
  );
}

export default App;
