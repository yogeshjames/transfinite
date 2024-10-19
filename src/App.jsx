// src/App.jsx
import React from 'react';
import Wallet from './components/Wallet';
import StartCampaign from './components/StartCampaign';
import Donate from './components/Donate';
import Fetch from './components/Fetch'
import CampaignTable from './components/CampaignTable';
import './App.css'; // Import CSS for styling

const App = () => {
  const [visibleDiv, setVisibleDiv] = useState(null);

  const toggleDiv = (divId) => {
    setVisibleDiv(visibleDiv === divId ? null : divId);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Donation Platform</h1>
        <div className="wallet-container">
          <Wallet />
        </div>
      </header>

      <div className="card-container">
        <div className="card" onClick={() => toggleDiv('div1')}>
          Start Campaign
        </div>
        <div className="card" onClick={() => toggleDiv('div2')}>
          Donate
        </div>
      </div>

      <div id="div1" className="content" style={{ display: visibleDiv === 'div1' ? 'block' : 'none' }}>
        <StartCampaign />
      </div>

      <div id="div2" className="content" style={{ display: visibleDiv === 'div2' ? 'block' : 'none' }}>
        <Donate />

        <CampaignTable />
      </div>
    </div>
  );
};

export default App;