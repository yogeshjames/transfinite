import React, { useEffect, useState } from 'react';
import { fetchCampaignById } from '../utils/tezos';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import DashboardTableRow from './DashboardTableRow'; // Assuming this component is already working

class ErrorBoundary extends React.Component {
    state = { hasError: false };
  
    static getDerivedStateFromError() {
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      console.error("Error caught in error boundary:", error, info);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>An error occurred while rendering toasts.</div>;
      }
      return this.props.children;
    }
}

const CampaignTable = () => {
    const [campaignData, setCampaignData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaignIds = async () => {
            try {
                toast.info("Loading campaigns...");

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
                toast.success("Campaigns loaded successfully!");
            } catch (error) {
                setError(error.message);
                toast.error(`Error: ${error.message}`);
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
        <div>
            {/* Table layout */}
            <table 
    style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#2D2D2D', // Dark gray background for the table
        border: '1px solid #444',   // Border around the table
    }}
>
    <thead>
        <tr>
            <th 
                style={{
                    padding: '8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ccc',
                    color: 'white', // White text color for headers
                    backgroundColor: '#333', // Darker background for headers
                }}
            >
                Campaign ID
            </th>
            <th 
                style={{
                    padding: '8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ccc',
                    color: 'white',
                    backgroundColor: '#333',
                }}
            >
                Fund Address
            </th>
            <th 
                style={{
                    padding: '8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ccc',
                    color: 'white',
                    backgroundColor: '#333',
                }}
            >
                Description
            </th>
            <th 
                style={{
                    padding: '8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ccc',
                    color: 'white',
                    backgroundColor: '#333',
                }}
            >
                Funding Goal
            </th>
            <th 
                style={{
                    padding: '8px',
                    textAlign: 'left',
                    borderBottom: '2px solid #ccc',
                    color: 'white',
                    backgroundColor: '#333',
                }}
            >
                Current Funding
            </th>
        </tr>
    </thead>
    <tbody>
        {/* Row for each campaign */}
        {campaignData.map((campaign) => (
            <DashboardTableRow
                key={campaign.campaignId}
                campaignId={campaign.campaignId}
                campaign_address={campaign.creator}
                name={campaign.description}
                fundingGoal={campaign.fundingGoal}
                currentFunding={campaign.currentFunding}
            />
        ))}
    </tbody>
</table>
        </div>
    );
};

export default CampaignTable;
