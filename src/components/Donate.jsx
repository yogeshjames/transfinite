import React, { useState } from 'react';
import { makeDonation } from '../utils/tezos';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import "./CampaignTable.css";

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

      // Show loading toast while the donation is being processed
      toast.info("Processing donation...");

      // Call the smart contract function to make a donation
      const operationHash = await makeDonation(campaignIdInt, donationAmount, campaignAddress); // Pass campaignAddress
      setOpHash(operationHash);
      
      // Show success toast after donation is processed
      toast.success("Donation successful! Operation hash: " + operationHash);

      // Send donation data to backend
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
      // Show error toast if donation fails
      toast.error(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="donation-container">
      <h2>Make a Donation</h2>
      <div className="donation-form">
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
          onChange={(e) => setCampaignAddress(e.target.value)} 
        />
        <button onClick={handleDonation} disabled={loading}>
          {loading ? 'Processing Donation...' : 'Donate'}
        </button>
      </div>
      {opHash && <p>Donation successful! Operation hash: {opHash}</p>}
      
      {/* Toast container to render toast notifications */}
    
    </div>
  );
};

export default Donate;
