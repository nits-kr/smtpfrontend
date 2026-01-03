import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCampaignMutation } from './campaignsApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const CampaignForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [createCampaign, { isLoading }] = useCreateCampaignMutation();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await createCampaign(data).unwrap();
            toast.success('Campaign created successfully');
            navigate('/campaigns');
        } catch (err) {
            toast.error('Failed to create campaign');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Create New Campaign</h1>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Campaign Name"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name}
                        placeholder="e.g. Weekly Newsletter"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Subject Line"
                            {...register('subject', { required: 'Subject is required' })}
                            error={errors.subject}
                            className="col-span-2"
                        />
                        <Input
                            label="Sender Index (From Name)"
                            {...register('senderName')}
                            placeholder="John Doe"
                        />
                        <Input
                            label="Reply-To Email"
                            type="email"
                            {...register('replyTo')}
                            placeholder="reply@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email Body (HTML)</label>
                        <textarea
                            {...register('body', { required: 'Email body is required' })}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-40 focus:outline-none focus:border-blue-500"
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" type="button" onClick={() => navigate('/campaigns')}>Cancel</Button>
                        <Button variant="primary" type="submit" isLoading={isLoading}>Create Campaign</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CampaignForm;
