import React, { useState } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('cover');
  const [username, setUsername] = useState('');

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogin = (name) => {
    setUsername(name);
    navigateTo('account');
  };

  return (
    <div className="App">
      {currentPage === 'cover' && <CoverPage onNext={() => navigateTo('login')} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'account' && <AccountPage username={username} onNavigate={navigateTo} />}
      
      {currentPage === 'findEvents' && <Question1Page onNext={() => navigateTo('question2')} />}
      {currentPage === 'question2' && <Question2Page onNext={() => navigateTo('question3')} />}
      {currentPage === 'question3' && <Question3Page onNext={() => navigateTo('question4')} />}
      {currentPage === 'question4' && <Question4Page onNext={() => navigateTo('question5')} />}
      {currentPage === 'question5' && <Question5Page onNext={() => navigateTo('map')} />}
      
      {currentPage === 'map' && <Map onBack={() => navigateTo('account')} />}
      {currentPage === 'yourEvents' && <YourEventsPage onBack={() => navigateTo('account')} />}
      {currentPage === 'createEvents' && <CreateEventsPage onBack={() => navigateTo('account')} />}
    </div>
  );
}

export default App;