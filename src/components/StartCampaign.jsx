import React, { useState } from 'react';
import { startCampaign } from '../utils/tezos';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const StartCampaign = () => {
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [adress, setadress] = useState(false);

  const handleStartCampaign = async () => {
    setLoading(true);
    try {
      // Ensure that campaign_id is a valid integer
      const campaignIdInt = parseInt(campaignId);
      const goalAmountInt = parseInt(goalAmount); // Parse the goal amount
      
      // Validate input
      if (isNaN(campaignIdInt) || isNaN(goalAmountInt)) {
        throw new Error('Campaign ID and Goal Amount must be valid integers.');
      }
      if (!title.trim()) {
        throw new Error('Campaign Title cannot be empty.');
      }

      // Call the smart contract function to start a campaign
      const address = await startCampaign(title, goalAmountInt, campaignIdInt);
      setadress(true);

      const response = await fetch('http://localhost:3000/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_address: address, // Replace with the actual campaign address
          campaign_id: campaignIdInt,
          goal: goalAmount,
          available: true // Default to true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add campaign to backend: ${errorData.error}`);
      }

      console.log('Campaign added to backend successfully');
    } catch (error) {
      console.error('Failed to start campaign:', error.message);
      toast.error(error.message); // Show error message as toast
    }
    setLoading(false);
  };

  return (
    <div className="campaign-container">
      <h2>Start a Campaign</h2>
      <div className="campaign-form">
        <input 
          type="text" 
          placeholder="Campaign Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Goal Amount (in tez)" 
          value={goalAmount} 
          onChange={(e) => setGoalAmount(e.target.value)} 
        />
        <input
          type="number"
          placeholder="Campaign ID"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
        />
        <button onClick={handleStartCampaign} disabled={loading}>
          {loading ? 'Starting Campaign...' : 'Start Campaign'}
        </button>
      </div>
      {adress && <p>Campaign started!</p>}
      
      {/* Toast container to render toast notifications */}
    
    </div>
  );
};

export default StartCampaign;
