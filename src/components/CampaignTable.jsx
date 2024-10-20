import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, VStack, Divider } from "@chakra-ui/react"; // Using Flex and Box for layout
import DashboardTableRow from "./DashboardTableRow";
import { fetchCampaignById } from '../utils/tezos';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


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
            {/* Using Flex layout instead of Table */}
            <VStack spacing={4} align="stretch">
                <Box padding={4} backgroundColor="gray.100" borderRadius="md" boxShadow="sm">
                    {/* Row for headers */}
                    <Flex justify="space-between" align="center" borderBottom="2px" borderColor="gray.200" paddingY={2}>
                        <Text fontWeight="bold" width="15%">Campaign ID</Text>
                        <Text fontWeight="bold" width="25%">Fund Address</Text>
                        <Text fontWeight="bold" width="30%">Description</Text>
                        <Text fontWeight="bold" width="15%">Funding Goal</Text>
                        <Text fontWeight="bold" width="15%">Current Funding</Text>
                    </Flex>
                    <Divider marginY={2} />
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
                </Box>
            </VStack>

           
        </div>
    );
};

export default CampaignTable;
