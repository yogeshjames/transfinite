import React, { useState } from 'react';
import { connectWallet, getTezos } from './utils/tezos';

const Donate = () => {
  const [campaignId, setCampaignId] = useState('');
  const [amount, setAmount] = useState(0);
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
      const contract = await Tezos.wallet.at('KT19UKaXx19zRCSNj239jiqCkYuiAufLAJgd');
      const operation = await contract.methodsObject.donate({ campaignId }).send({ amount });
      await operation.confirmation();
      alert('Donation successful!');
    } catch (error) {
      console.error('Error during donation:', error);
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>Connect Temple Wallet</button>
      <form onSubmit={handleSubmit}>
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
          <label>Sender Address:</label>
          <input type="text" value={senderAddress} readOnly required />
        </div>
        <div>
          <label>Donation Amount (Tez):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Donate</button>
      </form>
    </div>
  );
};

export default Donate;
