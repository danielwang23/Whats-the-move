import React from 'react';

function AccountPage({ username, onNavigate }) {
  return (
    <div className="account-page">
      <h2>Welcome, {username}!</h2>
      <button onClick={() => onNavigate('findEvents')}>Find Events</button>
      <button onClick={() => onNavigate('yourEvents')}>Your Events</button>
      <button onClick={() => onNavigate('createEvents')}>Create Events</button>
    </div>
  );
}

export default AccountPage;