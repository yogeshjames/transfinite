import { TempleWallet } from '@temple-wallet/dapp';
import { TezosToolkit } from '@taquito/taquito';

// Initialize Tezos toolkit with Ghostnet URL (testnet)
const Tezos = new TezosToolkit('https://ghostnet.smartpy.io');
let wallet = null;

// Replace with your actual deployed contract address
const contractAddress = 'KT1REqraefneBBfTqRATmgJLnuNm3FHkReGW'; 

// Connect Temple Wallet function
export const connectWallet = async () => {
  try {
    const available = await TempleWallet.isAvailable();
    if (!available) {
      throw new Error("Temple Wallet is not installed.");
    }

    wallet = new TempleWallet('Tezos Donation Platform');
    await wallet.connect('ghostnet');
    Tezos.setWalletProvider(wallet);

    const walletAddress = await wallet.getPKH();
    console.log("Wallet Address:", walletAddress);
    return walletAddress;
  } catch (error) {
    console.error("Failed to connect wallet:", error.message);
    return null;
  }
};

export const startCampaign = async (campaign_name, target_amount, campaign_id) => {
  try {
    // Ensure the wallet is connected before interacting with the contract
    if (!wallet) {
      throw new Error('Wallet is not connected. Please connect your Temple Wallet.');
    }
     console.log(campaign_name, target_amount, campaign_id);
    // Get the contract instance
    const contract = await Tezos.wallet.at(contractAddress);

    // Get the wallet address of the user creating the campaign
    const campaign_address = await wallet.getPKH(); 
    console.log(campaign_address)
    // Get the connected wallet address

    // Call the smart contract's 'start_campaign' entrypoint with the parameters
    const op = await contract.methods.start_campaign(campaign_address,campaign_id,campaign_name,target_amount).send();

    // Wait for confirmation of the transaction
    await op.confirmation();

    console.log(`Campaign started with operation hash: ${op.opHash}`);
    return op.opHash;
  } catch (error) {
    console.error('Error starting campaign:', error.message);
    throw error;
  }
};

// Make a Donation function (Interact with your smart contract)
export const makeDonation = async (campaign_id, amount) => {
  try {
    // Ensure the wallet is connected before interacting with the contract
    if (!wallet) {
      throw new Error('Wallet is not connected. Please connect your Temple Wallet.');
    }

    // Get the contract instance
    const contract = await Tezos.wallet.at(contractAddress);

    // Call the smart contract's 'donate' entrypoint with the donation amount in tez
    const op = await contract.methods.donate(campaign_id).send({ amount });

    // Wait for confirmation of the transaction
    await op.confirmation();

    console.log(`Donation made with operation hash: ${op.opHash}`);
    return op.opHash;
  } catch (error) {
    console.error('Error making donation:', error.message);
    throw error;
  }
};

// Get Tezos instance for interacting with the contract
export const getTezos = () => {
  return Tezos;
};
