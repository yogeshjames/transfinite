const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MongoDB connection URL and database details
const mongoURL = 'mongodb://localhost:27017/campaignDB'; // Adjust if using a remote MongoDB server

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define the Campaign Schema and Model
const campaignSchema = new mongoose.Schema({
  campaign_address: {
    type: String,
    required: true,
  },
  campaign_id: {
    type: Number,
    required: true,
    unique: true,
  },
  goal: {
    type: Number,
  },
  available: {
    type: Boolean,
    default: true, // Set default to true for active campaigns
  },
  donated: { // New field to track donations
    type: Number,
    default: 0, // Initialize to 0
  },
});

// Create the Campaign model based on the schema
const Campaign = mongoose.model('Campaign', campaignSchema);

// Insert Campaign (POST /campaigns)
app.post('/campaigns', async (req, res) => {
  const { campaign_address, campaign_id, goal } = req.body;

  // Validate incoming data
  if (!campaign_address || !campaign_id) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    // Create a new campaign instance with default available status and donated amount
    const newCampaign = new Campaign({ campaign_address, campaign_id, goal });

    // Save the campaign to the database
    await newCampaign.save();

    res.status(201).json({ message: 'Campaign inserted', campaign: newCampaign });
  } catch (error) {
    console.error('Failed to insert campaign:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Campaign ID must be unique' });
    }
    res.status(500).json({ error: 'Failed to insert campaign' });
  }
});

// Get All Available Campaigns (GET /campaigns/available)
app.get('/campaigns/available', async (req, res) => {
  try {
    const availableCampaigns = await Campaign.find({ available: true });
    res.status(200).json(availableCampaigns);
  } catch (error) {
    console.error('Failed to fetch available campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch available campaigns' });
  }
});

// Get Campaign by ID (GET /campaigns/:id)
app.get('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);

  try {
    const campaign = await Campaign.findOne({ campaign_id: campaignId });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Update Campaign by ID (PUT /campaigns/:id)
app.put('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);
  const { campaign_address, available } = req.body;

  try {
    const updatedCampaign = await Campaign.findOneAndUpdate(
      { campaign_id: campaignId },
      { campaign_address, available },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign updated', campaign: updatedCampaign });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete Campaign by ID (DELETE /campaigns/:id)
app.delete('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);

  try {
    const deletedCampaign = await Campaign.findOneAndDelete({ campaign_id: campaignId });
    if (!deletedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign deleted', campaign: deletedCampaign });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Donate to Campaign (POST /campaigns/:id/donate)
app.post('/campaigns/:id/donate', async (req, res) => {
  const campaignId = parseInt(req.params.id);
  const { amount } = req.body; // Expecting a donation amount in the request body

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }

  try {
    const updatedCampaign = await Campaign.findOneAndUpdate(
      { campaign_id: campaignId },
      { $inc: { donated: amount } }, // Increment the donated amount
      { new: true } // Return the updated document
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Donation added', campaign: updatedCampaign });
  } catch (error) {
    console.error('Failed to donate:', error);
    res.status(500).json({ error: 'Failed to donate' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
