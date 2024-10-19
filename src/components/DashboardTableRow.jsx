// src/components/Tables/DashboardTableRow.jsx
import React from 'react';
import { Tr, Td } from '@chakra-ui/react'; // Import necessary components from Chakra UI

const DashboardTableRow = ({ campaignId, campaign_address, name, fundingGoal, currentFunding }) => {
    return (
        <Tr><Td>{campaignId}</Td> {/* Display Campaign ID */}
            <Td>{campaign_address}</Td> {/* Display Creator (address) */}
            <Td>{name}</Td> {/* Display Description */}
            <Td>{`$${(fundingGoal / 1000000).toFixed(2)}`}</Td> {/* Display Funding Goal */}
            <Td>{`$${(currentFunding / 1000000).toFixed(2)}`}</Td> {/* Display Current Funding */}</Tr>
    );
};

export default DashboardTableRow;
