// src/components/CampaignTable.jsx
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Th, Tr } from "@chakra-ui/react"; // Make sure to import Chakra UI components
import DashboardTableRow from "./DashboardTableRow"; // Your newly created DashboardTableRow
import { fetchCampaignById } from '../utils/tezos'; // Import the fetch function
import axios from 'axios';
const CampaignTable = () => {
    const [campaignData, setCampaignData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaignIds = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/campaigns'); // Adjust the URL to match your backend
                const campaignIds = response.data;
                console.log(campaignIds);
                const campaigns = await Promise.all(
                    campaignIds.map(async (campaign) => {
                        const data = await fetchCampaignById(`${campaign.campaign_id}`);
                        console.log(data);
                        return data;
                    })
                );

                setCampaignData(campaigns);
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        };

        fetchCampaignIds();
    }, []);

    if (loading) {
        return <div>Loading campaigns...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
    <Table variant="simple">
    <Thead>
        <Tr><Th>Campaign ID</Th>
            <Th>Fund Address</Th>
            <Th>Description</Th>
            <Th>Funding Goal</Th>
            <Th>Current Funding</Th></Tr>
    </Thead>
    <Tbody>
        {campaignData.map((campaign) => (
            <DashboardTableRow
                key={campaign.campaignId}
                campaignId={campaign.campaignId} // Pass campaignId
                campaign_address={campaign.creator} // Pass creator address
                name={campaign.description} // Pass description
                fundingGoal={campaign.fundingGoal} // Pass funding goal
                currentFunding={campaign.currentFunding} // Pass current funding
                />
        ))}
    </Tbody>
</Table>
);
};

export default CampaignTable;
