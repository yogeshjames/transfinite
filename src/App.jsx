import React, { useState } from 'react';
import Wallet from './components/Wallet';
import StartCampaign from './components/StartCampaign';
import Donate from './components/Donate';
import CampaignTable from './components/CampaignTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'; // Import CSS for styling

const App = () => {
  const [visibleDiv, setVisibleDiv] = useState(null);
  <ToastContainer />
  const toggleDiv = (divId) => {
    setVisibleDiv(visibleDiv === divId ? null : divId);
  };

  return (
    <div className="App">
      <h1 className="title">Tez_rise</h1>
      <header className="header">
        <div className="wallet-container">
          <Wallet />
        </div>
      </header>

      
      {/* Add prompt text */}
      <div className="prompt-text">
        <p>Start or Donate for a Campaign?</p>
      </div>

      {/* Campaign action cards */}
      <div className="card-container">
        <div className="card" onClick={() => toggleDiv('div1')}>
          Start Campaign
        </div>
        <div className="card" onClick={() => toggleDiv('div2')}>
          Donate
        </div>
      </div>

      {/* Conditional rendering based on visibility */}
      <div id="div1" className="content" style={{ display: visibleDiv === 'div1' ? 'block' : 'none' }}>
        <StartCampaign />
      </div>

      <div id="div2" className="content" style={{ display: visibleDiv === 'div2' ? 'block' : 'none' }}>
        <Donate />
        <CampaignTable />
      </div>

      {/* About section */}
      {visibleDiv === null && (
  <div className="about-section">
    <h2>About </h2>
    <p>
      We are a public crowdfunding platform built on the Tezos SmartPy blockchain, empowering individuals and organizations to start and support meaningful campaigns. With Tez_rise, users can securely launch fundraising initiatives or contribute to causes they care about, leveraging the transparency, security, and efficiency of blockchain technology. Our platform ensures that every transaction is immutable and trustless, providing a decentralized solution for crowdfunding with low fees, global accessibility, and complete transparency. Whether you're a creator seeking support or a donor looking to make an impact, Tez_rise makes it easy to connect and contribute in a secure and innovative way.
    </p>
  </div>
)}

    </div>
  );
};

export default App;
