import React, { useState } from 'react';
import { connectWallet } from '../utils/tezos';

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>
        {walletAddress ? 'Connected' : 'Connect Temple Wallet'}
      </button>

      {walletAddress && (
        <div>
          <p>Wallet Address: {walletAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
