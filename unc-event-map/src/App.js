import React, { useState } from 'react';
import Map from './components/Map';
import { divIcon } from 'leaflet';
import './App.css';
import CoverPage from './components/CoverPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import Question1Page from './components/Question1Page';
import Question2Page from './components/Question2Page';
import YourEventsPage from './components/YourEventsPage';
import CreateEventsPage from './components/CreateEventsPage';


// Assembles the entire App Layout

function App() {
  const [currentPage, setCurrentPage] = useState('cover');
  const [username, setUsername] = useState('');

  const navigateTo = (page) => setCurrentPage(page);

  const handleLogin = (name) => {
    setUsername(name);
    navigateTo('account');
  };

  // const handleGetStarted = () => {
  //   setShowCoverPage(false);
  // };

  // return (
  //   <div className="App">
  //     {showCoverPage ?  (
  //       <CoverPage onGetStarted={handleGetStarted} />
  //     ) : (
  //       <>
  //         <h1>UNC Events Map</h1>
  //         <Map />
  //       </>
  //     )}
  //   </div>
  // )

  return (
    <div className="App">
      {currentPage === 'cover' && <CoverPage onNext={() => navigateTo('login')} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'account' && <AccountPage username={username} onNavigate={navigateTo} />}
      {currentPage === 'findEvents' && <Question1Page onNext={() => navigateTo('question2')} />}
      {currentPage === 'question2' && <Question2Page onNext={() => navigateTo('map')} />}
      {currentPage === 'map' && <Map onBack={() => navigateTo('account')} />} {/* Pass onBack prop */}
      {currentPage === 'yourEvents' && <YourEventsPage onBack={() => navigateTo('account')} />}
      {currentPage === 'createEvents' && <CreateEventsPage onBack={() => navigateTo('account')} />}
    </div>
  );
}

export default App;
