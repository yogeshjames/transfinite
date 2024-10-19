const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// MongoDB connection URL and database details
const url = 'mongodb://localhost:27017'; // Change this for a remote MongoDB server
const dbName = 'campaignDB';
const collectionName = 'campaigns';

const app = express();
app.use(bodyParser.json());

// Function to connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db(dbName);
  return { client, db };
}

// Insert Campaign (POST /campaigns)
app.post('/campaigns', async (req, res) => {
  const { campaign_address, campaign_id, available } = req.body;

  if (!campaign_address || !campaign_id || typeof available !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const campaign = { campaign_address, campaign_id, available };

  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);
    
    await collection.insertOne(campaign);
    client.close();

    res.status(201).json({ message: 'Campaign inserted', campaign });
  } catch (error) {
    res.status(500).json({ error: 'Failed to insert campaign' });
  }
});

// Get All Campaigns (GET /campaigns)
app.get('/campaigns', async (req, res) => {
  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const campaigns = await collection.find({}).toArray();
    client.close();

    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get Available Campaigns (GET /campaigns/available)
app.get('/campaigns/available', async (req, res) => {
  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const availableCampaigns = await collection.find({ available: true }).toArray();
    client.close();

    res.status(200).json(availableCampaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available campaigns' });
  }
});

// Get Campaign by ID (GET /campaigns/:id)
app.get('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);

  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const campaign = await collection.findOne({ campaign_id: campaignId });
    client.close();

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Update Campaign by ID (PUT /campaigns/:id)
app.put('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);
  const { campaign_address, available } = req.body;

  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const updated = await collection.updateOne(
      { campaign_id: campaignId,campaign_address:campaign_address },
      { $set: {  available } }
    );
    client.close();

    if (updated.matchedCount === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete Campaign by ID (DELETE /campaigns/:id)
app.delete('/campaigns/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);

  try {
    const { client, db } = await connectToMongoDB();
    const collection = db.collection(collectionName);

    const deleted = await collection.deleteOne({ campaign_id: campaignId });
    client.close();

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});