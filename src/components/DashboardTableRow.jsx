import React from 'react';
import { toast } from 'react-toastify';

const DashboardTableRow = ({ campaignId, campaign_address, name, fundingGoal, currentFunding }) => {
    
    const handleRowClick = () => {
        // Trigger a toast when the row is clicked
        toast.info(`Campaign ID: ${campaignId} - ${name} clicked!`);
    };

    return (
        <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{campaignId}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{campaign_address}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{name}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>${(fundingGoal / 1000000).toFixed(2)}</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>${(currentFunding / 1000000).toFixed(2)}</td>
        </tr>
    );
};

export default DashboardTableRow;
