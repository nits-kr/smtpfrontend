import React from 'react';
import { useGetCampaignsQuery, useUpdateCampaignStatusMutation } from './campaignsApi';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import { FiPlay, FiPause, FiPlus, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CampaignList = () => {
    const { data, isLoading } = useGetCampaignsQuery();
    const [updateStatus] = useUpdateCampaignStatusMutation();
    const navigate = useNavigate();

    // Mock Payload fallback
    const campaigns = data?.campaigns || [
        { _id: '101', name: 'Black Friday Sale', status: 'draft', sent: 0, total: 5000, createdAt: '2026-01-03' },
        { _id: '102', name: 'Welcome Series', status: 'active', sent: 1200, total: 5000, createdAt: '2026-01-02' },
        { _id: '103', name: 'Newsletter Jan', status: 'paused', sent: 450, total: 2000, createdAt: '2026-01-01' },
    ];

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Campaign ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const columns = [
        { key: 'name', label: 'Campaign Name' },
        {
            key: 'status', label: 'Status', render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                ${row.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        row.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-slate-700 text-slate-300'}`}>
                    {row.status}
                </span>
            )
        },
        {
            key: 'progress', label: 'Progress', render: (row) => (
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(row.sent / row.total) * 100}%` }}></div>
                </div>
            )
        },
        { key: 'createdAt', label: 'Created', render: (row) => row.createdAt?.slice(0, 10) },
        {
            key: 'actions', label: 'Actions', render: (row) => (
                <div className="flex gap-2">
                    {row.status === 'active' ? (
                        <Button variant="secondary" size="sm" onClick={() => handleStatusChange(row._id, 'paused')}><FiPause /></Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={() => handleStatusChange(row._id, 'active')} disabled={row.status === 'completed'}><FiPlay /></Button>
                    )}
                    <Button variant="ghost" size="sm"><FiEye /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h1 className="text-xl font-bold text-white">Campaigns</h1>
                <Button variant="primary" onClick={() => navigate('/campaigns/new')}>
                    <FiPlus className="mr-2" /> New Campaign
                </Button>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md">
                <DataTable columns={columns} data={campaigns} loading={isLoading} />
            </div>
        </div>
    );
};

export default CampaignList;
