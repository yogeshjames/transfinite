import { TempleWallet } from '@temple-wallet/dapp';
import { TezosToolkit } from '@taquito/taquito';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    toast.success("Wallet connected successfully!");
    return walletAddress;
  } catch (error) {
    toast.error(`Failed to connect wallet: ${error.message}`);
    return null;
  }
};

const BIG_MAP_ID = 446260; // Your big_map ID from the contract

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
    const response = await fetch(`/tezos-api/chains/main/blocks/head/context/big_maps/${BIG_MAP_ID}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch campaign data');
    }

    const michelsonData = await response.json();
    const campaigns = parseCampaignData(michelsonData);
    const campaign = campaigns.find((c) => c.campaignId === campaignId);

    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    return campaign;
  } catch (error) {
    toast.error(`Error fetching campaign data: ${error.message}`);
    throw error;
  }
};

// Start a new campaign
export const startCampaign = async (campaign_name, target_amount, campaign_id) => {
  try {
    if (!wallet) {
      throw new Error('Wallet is not connected. Please connect your Temple Wallet.');
    }

    const contract = await Tezos.wallet.at(contractAddress);
    const campaign_address = await wallet.getPKH(); 

    const op = await contract.methods.start_campaign(
      campaign_address,
      campaign_id,
      campaign_name,
      target_amount * 1000000
    ).send();

    await op.confirmation();

    toast.success("Campaign started successfully!");
    return campaign_address;
  } catch (error) {
    toast.error(`Error starting campaign: ${error.message}`);
    throw error;
  }
};

// Make a donation to a campaign
export const makeDonation = async (campaign_id, amount, campaign_address) => {
  try {
    if (!wallet) {
      throw new Error('Wallet is not connected. Please connect your Temple Wallet.');
    }

    const contract = await Tezos.wallet.at(contractAddress);
    const sender = await wallet.getPKH();

    const op = await contract.methods.donate(
      amount * 1000000, // Convert amount to mutez
      campaign_address,
      campaign_id,
      sender
    ).send();

    await op.confirmation();

    toast.success("Donation made successfully!");
    return campaign_address;
  } catch (error) {
    toast.error(`Error making donation: ${error.message}`);
    throw error;
  }
};

// Get Tezos instance for interacting with the contract
export const getTezos = () => {
  return Tezos;
};
