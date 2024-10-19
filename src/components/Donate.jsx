import React, { useState } from 'react';
import { makeDonation } from '../utils/tezos';

const Donate = () => {
  const [campaignId, setCampaignId] = useState('');
  const [amount, setAmount] = useState('');
  const [campaignAddress, setCampaignAddress] = useState(''); // State for campaign address
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
      const operationHash = await makeDonation(campaignIdInt, donationAmount, campaignAddress); // Pass campaignAddress
      setOpHash(operationHash);
      const response = await fetch(`http://localhost:3000/campaigns/${campaignIdInt}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: donationAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to donate: ${errorData.error}`);
      }

      console.log('Donation added successfully');
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
      <input 
        type="text" 
        placeholder="Campaign Address" 
        value={campaignAddress} 
        onChange={(e) => setCampaignAddress(e.target.value)} // Update campaign address state
      />
      <button onClick={handleDonation} disabled={loading}>
        {loading ? 'Processing Donation...' : 'Donate'}
      </button>
      {opHash && <p>Donation successful! Operation hash: {opHash}</p>}
    </div>
  );
};

export default Donate;
