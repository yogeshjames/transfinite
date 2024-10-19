// src/App.jsx
import React from 'react';
import Wallet from './components/Wallet';
import StartCampaign from './components/StartCampaign';
import Donate from './components/Donate';
import Fetch from './components/Fetch'
import CampaignTable from './components/CampaignTable';
const App = () => {
  return (
    <div>
      <h1>Donation Platform</h1>
      <Wallet />
      <StartCampaign />
      <Donate />
      
      //<CampaignTable />
    </div>
  );
};

export default App;
