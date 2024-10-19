import { TempleWallet } from '@temple-wallet/dapp';
import { TezosToolkit } from '@taquito/taquito';

// Initialize Tezos toolkit with Ghostnet URL (testnet)
const Tezos = new TezosToolkit('https://ghostnet.smartpy.io');
let wallet = null;

// Replace with your actual deployed contract address
const contractAddress = 'KT1ST7nQQ2mRreMfmsNnovChtfktTuf6t38M'; 

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

const BIG_MAP_ID = 446260; // Your big_map ID from the contract

// Fetch campaign data by campaign_id from big map
// Replace the URL with the proxy path // Make sure this is your actual big map ID

// Function to parse Michelson data
const parseCampaignData = (michelsonData) => {
  return michelsonData.map((item) => {
    const args = item.prim === "Pair" ? item.args : [];

    return {
      creator: args[0]?.string || '', // Creator's Tezos address
      campaignId: args[1]?.int || '',  // Campaign ID
      description: args[2]?.string || '', // Description of the campaign
      participants: (args[3] || []).map((p) => p.string), // List of participant addresses
      fundingGoal: parseInt(args[4]?.int, 10) || 0, // Funding goal
      currentFunding: parseInt(args[5]?.int, 10) || 0, // Current funding
    };
  });
};

// Function to fetch campaign data from the Tezos API
export const fetchCampaignById = async (campaignId) => {
  try {
    // Fetch the data from the proxy path /tezos-api
    const response = await fetch(`/tezos-api/chains/main/blocks/head/context/big_maps/${BIG_MAP_ID}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch campaign data');
    }

    // Get the Michelson data
    const michelsonData = await response.json();

    // Parse the Michelson data
    const campaigns = parseCampaignData(michelsonData);

    // Filter and find the campaign by campaignId
    const campaign = campaigns.find((c) => c.campaignId === campaignId);

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    throw error;
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
    const op = await contract.methods.start_campaign(campaign_address,campaign_id,campaign_name,target_amount*1000000).send();

    // Wait for confirmation of the transaction
    await op.confirmation();

    console.log(`Campaign started with operation hash: ${op.opHash}`);
    return campaign_address;
  } catch (error) {
    console.error('Error starting campaign:', error.message);
    throw error;
  }
};


//
export const makeDonation = async (campaign_id, amount, campaign_address) => {
  try {
    // Ensure the wallet is connected before interacting with the contract
    if (!wallet) {
      throw new Error('Wallet is not connected. Please connect your Temple Wallet.');
    }

    // Get the contract instance
    const contract = await Tezos.wallet.at(contractAddress);

    // Get the sender's address
    const sender = await wallet.getPKH();

    // Log the values to debug
    console.log("Campaign ID:", campaign_id);
    console.log("Amount:", amount);
    console.log("Campaign Address:", campaign_address);
    console.log("Sender Address:", sender);

    // Call the smart contract's 'donate' entrypoint with the individual parameters
    const op = await contract.methods.donate( amount * 1000000,campaign_address, campaign_id,sender, ).send(); // Convert amount to mutez

    // Wait for confirmation of the transaction
    await op.confirmation();

    console.log(`Donation made with operation hash: ${op.opHash}`);
    return campaign_address;
  } catch (error) {
    console.error('Error making donation:', error.message);
    throw error;
  }
};

// Get Tezos instance for interacting with the contract
export const getTezos = () => {
  return Tezos;
};
