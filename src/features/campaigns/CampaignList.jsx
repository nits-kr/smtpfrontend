import React, { useEffect } from 'react';
import { useGetCampaignsQuery, useUpdateCampaignStatusMutation } from './campaignsApi';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/ui/Button';
import { FiPlay, FiPause, FiPlus, FiEye, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CampaignList = () => {
    const { data, isLoading, error, refetch } = useGetCampaignsQuery();
    const [updateStatus] = useUpdateCampaignStatusMutation();
    const navigate = useNavigate();


    // Handle API errors
    useEffect(() => {
        if (error) {
            let errorMessage = 'Failed to load campaigns';

            // Check for different error structures
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.error) {
                errorMessage = error.error;
            } else if (error?.status === 'FETCH_ERROR') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error?.status === 'PARSING_ERROR') {
                errorMessage = 'Error parsing server response.';
            } else if (error?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error?.status === 404) {
                errorMessage = 'Campaigns endpoint not found.';
            } else if (error?.status === 401) {
                errorMessage = 'Unauthorized. Please login again.';
            } else if (error?.status === 403) {
                errorMessage = 'You do not have permission to view campaigns.';
            }

            toast.error(
                <div className="flex items-center gap-2">
                    <FiAlertCircle className="text-xl" />
                    <span>{errorMessage}</span>
                </div>,
                {
                    toastId: 'campaigns-error',
                    autoClose: 5000,
                }
            );
        }
    }, [error, navigate]);

    // Format date to readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (err) {
            return 'Invalid Date';
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
            case 'processing':
                return 'bg-green-500/20 text-green-400';
            case 'paused':
            case 'draft':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'completed':
                return 'bg-blue-500/20 text-blue-400';
            case 'failed':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-slate-700 text-slate-300';
        }
    };

    // Get status display text
    const getStatusText = (status) => {
        switch (status) {
            case 'processing':
                return 'Processing';
            case 'draft':
                return 'Draft';
            case 'active':
                return 'Active';
            case 'paused':
                return 'Paused';
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            default:
                return status || 'Unknown';
        }
    };

    // Process campaign data from API response
    const campaigns = React.useMemo(() => {

        // If data exists and has results, use it
        if (data?.success && data?.results) {
            return data.results.map(campaign => ({
                _id: campaign?._id || '',
                name: campaign?.name || 'Unnamed Campaign',
                subject: campaign?.subject || 'No Subject',
                status: campaign?.status || 'draft',
                fromName: campaign?.fromName || 'Unknown',
                fromEmail: campaign?.fromEmail || 'no-email@example.com',
                recipientsCount: campaign?.recipientsCount || campaign?.recipients?.length || 0,
                createdAt: campaign?.createdAt,
                updatedAt: campaign?.updatedAt
            }));
        }

        // Fallback to empty array if error or no data
        return [];
    }, [data, error]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Campaign status updated to ${getStatusText(newStatus)}`);
            refetch();
        } catch (err) {
            let errorMessage = 'Failed to update campaign status';
            if (err?.data?.message) {
                errorMessage = err.data.message;
            }
            toast.error(errorMessage);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Campaign Name',
            render: (value, row) => (
                <div>
                    <div className="font-medium text-white">{row?.name || 'Unnamed Campaign'}</div>
                    <div className="text-sm text-slate-400">{row?.subject || 'No Subject'}</div>
                </div>
            )
        },
        {
            key: 'from',
            label: 'From',
            render: (value, row) => (
                <div>
                    <div className="text-sm">{row?.fromName || 'Unknown'}</div>
                    <div className="text-xs text-slate-400">{row?.fromEmail || 'no-email@example.com'}</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (value, row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(row?.status)}`}>
                    {getStatusText(row?.status)}
                </span>
            )
        },
        {
            key: 'recipientsCount',
            label: 'Recipients',
            align: 'center',
            render: (value, row) => (
                <div className="text-center">
                    <div className="font-bold">{row?.recipientsCount || 0}</div>
                    <div className="text-xs text-slate-400">contacts</div>
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value, row) => formatDate(row?.createdAt)
        },
        {
            key: 'actions',
            label: 'Actions',
            align: 'center',
            render: (value, row) => (
                <div className="flex gap-2 justify-center">
                    {row?.status === 'active' ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(row?._id, 'paused')}
                            title="Pause Campaign"
                        >
                            <FiPause />
                        </Button>
                    ) : row?.status === 'paused' ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(row?._id, 'active')}
                            title="Resume Campaign"
                        >
                            <FiPlay />
                        </Button>
                    ) : row?.status === 'draft' ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/campaigns/edit/${row?._id}`)}
                            title="Edit Campaign"
                        >
                            Edit
                        </Button>
                    ) : null}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/campaigns/${row?._id}/live`)}
                        // onClick={() => navigate(`/campaigns/${row?._id}`)}
                        title="View Details"
                    >
                        <FiEye />
                    </Button>
                </div>
            )
        }
    ];

    const handleRetry = () => {
        toast.info('Refreshing campaigns...');
        refetch();
    };

    // Show error state
    if (error && !data) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h1 className="text-xl font-bold text-white">Campaigns</h1>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleRetry}>
                            Retry
                        </Button>
                        <Button variant="primary" onClick={() => navigate('/campaigns/new')}>
                            <FiPlus className="mr-2" /> New Campaign
                        </Button>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md p-8 text-center">
                    <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Failed to Load Campaigns</h2>
                    <p className="text-slate-400 mb-6">
                        {error?.data?.message || 'Unable to connect to the server. Please check your connection.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="primary" onClick={handleRetry}>
                            Try Again
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white">Campaigns</h1>
                    {!isLoading && campaigns.length > 0 && (
                        <span className="text-sm text-slate-400">
                            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {error && data && (
                        <Button variant="secondary" onClick={handleRetry} size="sm">
                            Refresh
                        </Button>
                    )}
                    <Button variant="primary" onClick={() => navigate('/campaigns/new')}>
                        <FiPlus className="mr-2" /> New Campaign
                    </Button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading campaigns...</p>
                    </div>
                ) : campaigns.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={campaigns}
                        searchable={true}
                    />
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-slate-400">No campaigns found. Create your first campaign to get started!</p>
                        <Button
                            variant="primary"
                            className="mt-4"
                            onClick={() => navigate('/campaigns/new')}
                        >
                            <FiPlus className="mr-2" /> Create Campaign
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignList;