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
      <button
        onClick={handleConnectWallet}
        style={{
          backgroundColor: '#F0BD36', // Button background color
          color: '#fff',               // White text color
          padding: '10px 20px',        // Padding for the button
          fontSize: '16px',            // Font size for text
          border: 'none',              // No border for the button
          borderRadius: '5px',        // Rounded corners
          cursor: 'pointer',          // Pointer cursor on hover
          transition: 'background-color 0.3s', // Smooth transition for background color
        }}
      >
        {walletAddress ? 'Connected' : 'Connect  Wallet'}
      </button>

      {/* Toast container to render toast notifications */}
    </div>
  );
};

export default Wallet;
