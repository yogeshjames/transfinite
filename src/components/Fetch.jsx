// FetchCampaign.jsx
import React, { useState, useEffect } from 'react';
import { fetchCampaignById } from '../utils/tezos'; // Import the fetch function

const FetchCampaign = ({ campaignId }) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCampaignById("2");
        setCampaign(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    getData();
  }, [campaignId]);

  if (loading) {
    return <div>Loading campaign data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Campaign Details</h1>
      {campaign ? (
        <div>
          <p><strong>Creator:</strong> {campaign.creator}</p>
          <p><strong>Campaign ID:</strong> {campaign.campaignId}</p>
          <p><strong>Description:</strong> {campaign.description}</p>
          <p><strong>Funding Goal:</strong> {campaign.fundingGoal/1000000}</p>
          <p><strong>Current Funding:</strong> {campaign.currentFunding/1000000}</p>
          <p><strong>Participants:</strong> {campaign.participants.length > 0 ? campaign.participants.join(', ') : 'No participants yet'}</p>
        </div>
      ) : (
        <div>No campaign found.</div>
      )}
    </div>
  );
};

export default FetchCampaign;
