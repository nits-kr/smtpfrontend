import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-toastify';
import { useCreateSubuserMutation } from '../auth/authApi';

const PERMISSION_GROUPS = [
    {
        name: 'Campaigns',
        permissions: [
            { id: 'campaign.create', label: 'Create Campaigns' },
            { id: 'campaign.read', label: 'View Campaigns' },
            { id: 'campaign.update', label: 'Edit Campaigns' },
            { id: 'campaign.delete', label: 'Delete Campaigns' },
        ]
    },
    {
        name: 'Lists',
        permissions: [
            { id: 'list.create', label: 'Create Lists' },
            { id: 'list.read', label: 'View Lists' },
            { id: 'list.manage', label: 'Manage Contacts' },
            { id: 'list.delete', label: 'Delete Lists' },
        ]
    },
    {
        name: 'Reports',
        permissions: [
            { id: 'reports.view', label: 'View Reports' },
            { id: 'reports.export', label: 'Export Data' },
        ]
    },
    {
        name: 'Settings',
        permissions: [
            { id: 'settings.view', label: 'View Settings' },
            { id: 'settings.manage', label: 'Manage Settings' },
        ]
    }
];

const AddSubUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [createSubuser] = useCreateSubuserMutation();

    const togglePermission = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        // Simulate API Payload Construction
        const payload = {
            ...data,
            role: 'subuser',
            permissions: selectedPermissions
        };

        console.log("Payload to Backend:", payload);

        const response = await createSubuser(payload).unwrap();
        console.log("response", response);


        setTimeout(() => {
            setIsLoading(false);
            toast.success('Subuser created successfully (Check Console for Payload)');
            // navigate('/users'); // Uncomment this when real API is integrated
            reset();
            setSelectedPermissions([]);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/users')} className="text-slate-400 hover:text-white transition-colors">
                        <FiArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Add New Subuser</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-semibold text-white mb-6">User Details</h2>
                        <form id="adduser-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                label="Full Name"
                                placeholder="Enter full name"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="user@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={errors.email}
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Secure password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                error={errors.password}
                            />
                        </form>
                    </div>
                </div>

                {/* Permissions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Permissions</h2>
                        <p className="text-slate-400 text-sm mb-6">Assign access rights for this subuser.</p>

                        <div className="space-y-6">
                            {PERMISSION_GROUPS.map((group) => (
                                <div key={group.name}>
                                    <h3 className="text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">{group.name}</h3>
                                    <div className="space-y-2">
                                        {group.permissions.map(perm => {
                                            const isSelected = selectedPermissions.includes(perm.id);
                                            return (
                                                <div
                                                    key={perm.id}
                                                    onClick={() => togglePermission(perm.id)}
                                                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all border ${isSelected
                                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                                                        }`}>
                                                        {isSelected && <FiCheck className="text-white text-xs" />}
                                                    </div>
                                                    <span className="text-sm">{perm.label}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        form="adduser-form"
                        disabled={isLoading}
                        className="w-full"
                        variant="primary"
                    >
                        {isLoading ? 'Creating...' : <><FiSave className="mr-2" /> Create Subuser</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddSubUser;
