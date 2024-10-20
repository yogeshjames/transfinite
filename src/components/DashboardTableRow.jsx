import React from 'react';
import { Flex, Text, Box } from "@chakra-ui/react"; // Using Flex and Box for layout
import { toast } from 'react-toastify';

const DashboardTableRow = ({ campaignId, campaign_address, name, fundingGoal, currentFunding }) => {
    
    const handleRowClick = () => {
        // Trigger a toast when the row is clicked
        toast.info(`Campaign ID: ${campaignId} - ${name} clicked!`);
    };

    return (
        <Flex 
            justify="space-between" 
            align="center" 
            paddingY={2} 
            borderBottom="1px" 
            borderColor="gray.200" 
            cursor="pointer"
            onClick={handleRowClick}
        >
            <Text width="15%">{campaignId}</Text> {/* Display Campaign ID */}
            <Text width="25%">{campaign_address}</Text> {/* Display Creator (address) */}
            <Text width="30%">{name}</Text> {/* Display Description */}
            <Text width="15%">{`$${(fundingGoal / 1000000).toFixed(2)}`}</Text> {/* Display Funding Goal */}
            <Text width="15%">{`$${(currentFunding / 1000000).toFixed(2)}`}</Text> {/* Display Current Funding */}
        </Flex>
    );
};

export default DashboardTableRow;
