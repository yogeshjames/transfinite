import React, { useState } from 'react';
import { startCampaign } from '../utils/tezos';

const StartCampaign = () => {
  const [title, setTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const [opHash, setOpHash] = useState(null);

  const handleStartCampaign = async () => {
    setLoading(true);
    try {
      // Ensure that campaign_id is a valid integer
      const campaignIdInt = parseInt(campaignId);
      if (isNaN(campaignIdInt)) {
        throw new Error('Campaign ID must be a valid integer.');
      }

      // Call the smart contract function to start a campaign
      const operationHash = await startCampaign(campaignIdInt, title, parseInt(goalAmount));
      setOpHash(operationHash);
    } catch (error) {
      console.error('Failed to start campaign:', error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Start a Campaign</h2>
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
      {opHash && <p>Campaign started! Operation hash: {opHash}</p>}
    </div>
  );
};

export default StartCampaign;
