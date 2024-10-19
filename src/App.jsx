import React from 'react';
import Wallet from './components/Wallet';
import StartCampaign from './components/StartCampaign';
import Donation from './components/Donation';

function App() {
  return (
    <div className="App">
      <h1>Tezos Donation Platform</h1>
      
      {/* Connect Wallet */}
      <Wallet />

      {/* Start a Campaign */}
      <StartCampaign />

      {/* Make a Donation */}
      <Donation />
    </div>
  );
}

export default App;
