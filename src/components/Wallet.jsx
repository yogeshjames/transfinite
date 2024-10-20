import React, { useState } from 'react';
import { connectWallet } from '../utils/tezos';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles

const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        toast.success('Wallet connected successfully!'); // Display success toast
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
      toast.error(`Error connecting wallet: ${error.message}`); // Display error toast
    }
  };

  return (
    <div>
      <button onClick={handleConnectWallet}>
        {walletAddress ? 'Connected' : 'Connect Temple Wallet'}
      </button>

      {/* Toast container to render toast notifications */}
    </div>
  );
};

export default Wallet;
