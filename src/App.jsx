// src/App.jsx
import React from 'react';
import Wallet from './components/Wallet';
import StartCampaign from './components/StartCampaign';
import Donate from './components/Donate';

const App = () => {
  return (
    <div>
      <h1>Donation Platform</h1>
      <Wallet />
      <StartCampaign />
      <Donate />
    </div>
  );
};

export default App;
