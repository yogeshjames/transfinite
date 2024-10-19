import React, { useState } from 'react';
import { connectWallet, getTezos } from './utils/tezos';

const StartCampaign = () => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [senderAddress, setSenderAddress] = useState('');

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setSenderAddress(address);
        alert('Wallet connected: ' + address);
      }
    } catch (error) {
      console.error('Failed to connect Temple wallet', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const Tezos = getTezos();
      const contract = await Tezos.contract.at('KT19UKaXx19zRCSNj239jiqCkYuiAufLAJgd');
      console.log("good");
    //   const operation = await contract.methods
    //     .startCampaign(campaignName, campaignId, totalAmount)
    //     .send();
        const operation = await contract.methodsObject.StartCampaign({ campaignId }).send({ amount });
        console.log('send');
      await operation.confirmation();   
      alert('Campaign started successfully!');
    } catch (error) {
      console.error('Error starting campaign:', error);
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>Connect Temple Wallet</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Campaign Name:</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Campaign ID:</label>
          <input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Amount (Tez):</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Start Campaign</button>
      </form>
    </div>
  );
};

export default StartCampaign;
