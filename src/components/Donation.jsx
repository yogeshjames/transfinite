import React, { useState } from 'react';
import { makeDonation } from '../utils/tezos';

const Donation = () => {
  const [campaignId, setCampaignId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [opHash, setOpHash] = useState(null);

  const handleDonation = async () => {
    setLoading(true);
    try {
      // Parse campaignId and amount to numbers
      const campaignIdInt = parseInt(campaignId);
      const donationAmount = parseFloat(amount);

      // Check if the values are valid numbers
      if (isNaN(campaignIdInt) || isNaN(donationAmount)) {
        throw new Error('Please enter a valid Campaign ID and donation amount.');
      }

      // Call the smart contract function to make a donation
      const operationHash = await makeDonation(campaignIdInt, donationAmount);
      setOpHash(operationHash);
    } catch (error) {
      console.error('Failed to make donation:', error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Make a Donation</h2>
      <input 
        type="number" 
        placeholder="Campaign ID" 
        value={campaignId} 
        onChange={(e) => setCampaignId(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Donation Amount (in tez)" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      <button onClick={handleDonation} disabled={loading}>
        {loading ? 'Processing Donation...' : 'Donate'}
      </button>
      {opHash && <p>Donation successful! Operation hash: {opHash}</p>}
    </div>
  );
};

export default Donation;
