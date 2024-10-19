// Donate.jsx
import React, { useState, useEffect } from 'react';
import { donateToCampaign } from './tezos';
import { connectWallet, getActiveAccount } from './wallet';

const Donate = ({ campaignId, campaignAddress }) => {
    const [donationAmount, setDonationAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        // Auto-connect wallet if active session exists
        const loadWallet = async () => {
            const account = await getActiveAccount();
            if (account) {
                setWalletAddress(account.address);
            }
        };
        loadWallet();
    }, []);

    const handleDonate = async () => {
        if (!walletAddress) {
            const address = await connectWallet();
            setWalletAddress(address);
        }

        try {
            const op = await donateToCampaign(campaignId, donationAmount, campaignAddress);
            console.log(`Donation successful: ${op.hash}`);
        } catch (error) {
            console.error(`Donation failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Donate to Campaign</h2>
            <p>Campaign Address: {campaignAddress}</p>
            <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter donation amount in Tez"
            />
            <button onClick={handleDonate}>
                {walletAddress ? 'Donate' : 'Connect Wallet & Donate'}
            </button>
        </div>
    );
};

export default Donate;
