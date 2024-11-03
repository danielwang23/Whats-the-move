import React from 'react';
import './AccountPageCSS.css';

function AccountPage({ username, onNavigate }) {
    return (
        <div className="account-page">
    <h2 className="account-title">What's the move, {username}?</h2>
    <div className="account-divider"></div>
    <div className="account-options">
        <div className="option-card" onClick={() => onNavigate('findEvents')}>
        <div className="option-card-inner">Find Events</div>
        </div>
        <div className="option-card" onClick={() => onNavigate('yourEvents')}>
        <div className="option-card-inner">View Your Events</div>
        </div>
        <div className="option-card" onClick={() => onNavigate('createEvents')}>
        <div className="option-card-inner">Create Event Post</div>
        </div>
    </div>
    </div>
);
}

export default AccountPage;