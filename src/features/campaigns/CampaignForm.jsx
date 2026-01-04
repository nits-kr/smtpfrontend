import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiCheck, FiChevronRight, FiChevronLeft, FiUpload, FiCode, FiEye, FiSettings, FiSend, FiSearch, FiDownload } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useCreateCampaignMutation } from './campaignsApi';

// --- STEP COMPONENTS ---
const Step1 = () => {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 1: Campaign Setup</h2>

            {/* Campaign Search and Load - From Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Campaign Search</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-grow bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Search campaigns..."
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                        >
                            Load
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Campaign Template</label>
                    <select
                        {...register('template')}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    >
                        <option value="">None</option>
                        <option value="pptrom-email">PPTrom-Email</option>
                        <option value="newsletter">Newsletter Template</option>
                        <option value="promotional">Promotional Template</option>
                    </select>
                </div>
            </div>

            <Input
                label="Campaign Name"
                {...register('name', { required: 'Campaign Name is required' })}
                error={errors.name}
                placeholder="e.g. Monthly Newsletter - Jan 2026"
            />

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
                <textarea
                    {...register('description')}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-24 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Internal reference notes..."
                />
            </div>
        </div>
    );
};

const Step2 = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const recipientsText = watch('recipientsText');
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });

    useEffect(() => {
        if (!recipientsText) {
            setStats({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
            return;
        }

        const lines = recipientsText.split(/[\n,;]+/).map(l => l.trim()).filter(Boolean);
        const total = lines.length;
        const unique = new Set(lines);
        const duplicates = total - unique.size;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let valid = 0;
        let invalid = 0;

        unique.forEach(line => {
            const parts = line.split(':');
            const email = parts.length > 1 ? parts[1] : parts[0];
            if (emailRegex.test(email)) valid++;
            else invalid++;
        });

        const newStats = { total, valid, invalid, duplicates };
        setStats(newStats);
        setValue('recipientStats', newStats, { shouldValidate: true });
    }, [recipientsText, setValue]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setValue('recipientsText', event.target.result || '', { shouldValidate: true });
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 2: Add Recipients</h2>

            <input
                type="hidden"
                {...register('recipientStats', {
                    validate: (value) => (value && value.valid > 0) || "Please add at least one valid recipient"
                })}
            />

            {errors.recipientStats && (
                <p className="text-red-400 text-sm font-bold bg-red-900/20 p-2 rounded">{errors.recipientStats.message}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Total Lines</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Valid Emails</div>
                    <div className="text-2xl font-bold text-green-400">{stats.valid}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Invalid</div>
                    <div className="text-2xl font-bold text-red-400">{stats.invalid}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <div className="text-sm text-slate-400">Duplicates Removed</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.duplicates}</div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    Paste Emails or IPs (One per line or comma/semicolon separated)
                </label>
                <textarea
                    {...register('recipientsText', { required: 'Please enter recipients' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-48 font-mono text-sm focus:outline-none focus:border-blue-500"
                    placeholder="user@example.com&#10;192.168.1.1:admin@test.com&#10;another@domain.com"
                />
                {errors.recipientsText && <p className="text-red-500 text-xs mt-1">{errors.recipientsText.message}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                    <input
                        type="file"
                        id="csvUpload"
                        className="hidden"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                    />
                    <label
                        htmlFor="csvUpload"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition-colors border border-slate-600"
                    >
                        <FiUpload />
                        Upload Text/CSV
                    </label>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                    onClick={() => {
                        // Clear recipients
                        setValue('recipientsText', '');
                    }}
                >
                    Clear All
                </button>

                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                    onClick={() => {
                        // Sample data for testing
                        setValue('recipientsText', 'test1@example.com\ntest2@domain.com\n192.168.1.1:admin@test.com');
                    }}
                >
                    Load Sample
                </button>

                <span className="text-xs text-slate-500">Supported formats: .txt, .csv (one email per line)</span>
            </div>
        </div>
    );
};

const Step3 = () => {
    const { register, watch, formState: { errors } } = useFormContext();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSpaceSending, setShowSpaceSending] = useState(false);
    const contentType = watch('contentType');
    const encoding = watch('encoding');

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 3: Sender Configuration</h2>

            {/* Settings Dropdown - Updated per image */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center justify-between w-full p-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                    <span className="font-medium">Settings</span>
                    <span className={`transform transition-transform ${showSettings ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showSettings && (
                    <div className="mt-2 p-4 bg-slate-900/50 border border-slate-700 rounded space-y-4">
                        {/* First Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Data File</label>
                                <input
                                    type="text"
                                    {...register('dataFile')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Data file name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Total Send</label>
                                <input
                                    type="number"
                                    {...register('totalSend')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Limit_to_Send</label>
                                <input
                                    type="number"
                                    {...register('limitToSend')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Sleep Time</label>
                                <input
                                    type="number"
                                    {...register('sleepTime')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Seconds"
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Offer ID</label>
                                <input
                                    type="text"
                                    {...register('offerId')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Offer ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    {...register('templateName')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Template name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Domain</label>
                                <input
                                    type="text"
                                    {...register('domain')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Domain name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Wait Time</label>
                                <input
                                    type="number"
                                    {...register('waitTime')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Seconds"
                                />
                            </div>
                        </div>

                        {/* Third Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Message ID</label>
                                <input
                                    type="text"
                                    {...register('messageId')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Message ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reply to</label>
                                <input
                                    type="text"
                                    {...register('replyToSetting')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Reply to"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">XMAILER</label>
                                <input
                                    type="text"
                                    {...register('xmailer')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="XMAILER"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reply to</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('replyToEnabled')}
                                            value="yes"
                                            className="accent-blue-500"
                                        />
                                        <span className="text-sm text-slate-300">YES</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('replyToEnabled')}
                                            value="no"
                                            className="accent-blue-500"
                                        />
                                        <span className="text-sm text-slate-300">NO</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Space Sending Dropdown - Updated per image */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => setShowSpaceSending(!showSpaceSending)}
                    className="flex items-center justify-between w-full p-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Space Sending</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                {...register('spaceSendingEnabled')}
                                className="accent-blue-500"
                            />
                            <span className="text-xs text-slate-300">Space S</span>
                        </div>
                    </div>
                    <span className={`transform transition-transform ${showSpaceSending ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {showSpaceSending && (
                    <div className="mt-2 p-4 bg-slate-900/50 border border-slate-700 rounded space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Limit_to_Send</label>
                                <input
                                    type="number"
                                    {...register('spaceLimitToSend')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Sleep Time</label>
                                <input
                                    type="number"
                                    {...register('spaceSleepTime')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Seconds"
                                />
                            </div>

                            <div className="flex items-end">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                    >
                                        Start
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                    >
                                        Stop
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Offer ID</label>
                                <input
                                    type="text"
                                    {...register('spaceOfferId')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Offer ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Template Name</label>
                                <input
                                    type="text"
                                    {...register('spaceTemplateName')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Template name"
                                />
                            </div>

                            <div></div> {/* Empty div for grid alignment */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Domain</label>
                                <input
                                    type="text"
                                    {...register('spaceDomain')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Domain name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Wait Time</label>
                                <input
                                    type="number"
                                    {...register('spaceWaitTime')}
                                    min="0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Seconds"
                                />
                            </div>

                            <div></div> {/* Empty div for grid alignment */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Message ID</label>
                                <input
                                    type="text"
                                    {...register('spaceMessageId')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Message ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reply to</label>
                                <input
                                    type="text"
                                    {...register('spaceReplyTo')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="Reply to"
                                />
                            </div>

                            <div></div> {/* Empty div for grid alignment */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">XMAILER</label>
                                <input
                                    type="text"
                                    {...register('spaceXmailer')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="XMAILER"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">XMAILER</label>
                                <input
                                    type="text"
                                    {...register('spaceXmailer2')}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                    placeholder="XMAILER"
                                />
                            </div>

                            <div className="flex items-end">
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('spaceSending')}
                                            value="yes"
                                            className="accent-blue-500"
                                        />
                                        <span className="text-sm text-slate-300">YES</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register('spaceSending')}
                                            value="no"
                                            className="accent-blue-500"
                                        />
                                        <span className="text-sm text-slate-300">NO</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Additional Header - From Image */}
            <div className="mb-6 p-4 bg-slate-900/50 border border-slate-700 rounded">
                <h3 className="text-md font-semibold text-white mb-3">Additional Header</h3>

                {/* From Email Address */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">From Email Address</label>
                    <Input
                        {...register("fromEmail", {
                            required: "From Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address",
                            },
                        })}
                        error={errors.fromEmail}
                        placeholder="support@yourdomain.com"
                    />

                </div>

                {/* Subject */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                    <div className="flex gap-2">
                        <Input
                            {...register('subject', { required: 'Subject is required' })}
                            error={errors.subject}
                            placeholder="Don't miss out on this offer!"
                            className="flex-grow"
                        />
                        <div className="flex gap-1">
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('subjectEncoding')}
                                    value="q"
                                    className="accent-blue-500"
                                />
                                <span className="text-xs text-slate-300">UTF8-Q</span>
                            </label>
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('subjectEncoding')}
                                    value="b"
                                    className="accent-blue-500"
                                />
                                <span className="text-xs text-slate-300">UTF8-B</span>
                            </label>
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('subjectEncoding')}
                                    value="reset"
                                    className="accent-blue-500"
                                    defaultChecked
                                />
                                <span className="text-xs text-slate-300">RESET</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* From Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">From Name</label>
                    <div className="flex gap-2">
                        <Input
                            {...register('senderName')}
                            placeholder="e.g. Support Team"
                            className="flex-grow"
                        />
                        <div className="flex gap-1">
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('senderNameEncoding')}
                                    value="q"
                                    className="accent-blue-500"
                                />
                                <span className="text-xs text-slate-300">UTF8-Q</span>
                            </label>
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('senderNameEncoding')}
                                    value="b"
                                    className="accent-blue-500"
                                />
                                <span className="text-xs text-slate-300">UTF8-B</span>
                            </label>
                            <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded cursor-pointer">
                                <input
                                    type="radio"
                                    {...register('senderNameEncoding')}
                                    value="reset"
                                    className="accent-blue-500"
                                    defaultChecked
                                />
                                <span className="text-xs text-slate-300">RESET</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Content Type Selector - From Image */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Format</label>
                <div className="flex bg-slate-800 rounded p-1 w-fit">
                    {['plain', 'html', 'mime'].map((type) => (
                        <label
                            key={type}
                            className={`
                flex items-center gap-2 px-4 py-2 cursor-pointer rounded
                ${contentType === type ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
              `}
                        >
                            <input
                                type="radio"
                                {...register('contentType')}
                                value={type}
                                className="hidden"
                            />
                            {type.toUpperCase()}
                        </label>
                    ))}
                </div>
            </div>

            {/* Preview Options - From Image */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                    >
                        <FiEye />
                        Preview
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                    >
                        <FiCode />
                        EDITOR
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors border border-slate-600"
                    >
                        Search & Replace
                    </button>
                </div>
            </div>

            {/* Reply-To */}
            <Input
                label="Reply-To Email"
                {...register('replyTo', {
                    pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' },
                })}
                error={errors.replyTo}
                placeholder="Optional"
            />

            {/* Advanced Settings */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    <FiSettings />
                    {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                </button>

                {showAdvanced && (
                    <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Character Encoding</label>
                            <select
                                {...register('encoding')}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                            >
                                <option value="UTF-8">UTF-8 [Bait]</option>
                                <option value="US-ASCII">US-ASCII</option>
                                <option value="ISO-8859-1">ISO-8859-1</option>
                                <option value="WINDOWS-1256">WINDOWS-1256 (Arabic)</option>
                                <option value="SHIFT_JIS">SHIFT_JIS (Japanese)</option>
                                <option value="EUC-KR">EUC-KR (Korean)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Transfer Encoding</label>
                            <select
                                {...register('transferEncoding')}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                            >
                                <option value="8bit">8bit</option>
                                <option value="7bit">7bit</option>
                                <option value="binary">binary</option>
                                <option value="quoted-printable">quoted-printable</option>
                                <option value="base64">base64</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Custom Headers (JSON)</label>
                            <textarea
                                {...register('customHeaders')}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-20 font-mono text-xs"
                                placeholder='{"X-Custom-Header": "value", "X-Priority": "1"}'
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">MIME Message</label>
                            <textarea
                                {...register('mimeMessage')}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white h-24 font-mono text-xs"
                                placeholder="MIME formatted message content..."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step4 = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const [previewMode, setPreviewMode] = useState(false);
    const contentType = watch('contentType');
    const body = watch('body');
    const encoding = watch('encoding');

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Step 4: Email Content</h2>

                {/* Encoding Display - From Image */}
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">Encoding:</span>
                    <span className="text-sm text-blue-400 font-mono">{encoding}</span>
                </div>
            </div>

            {/* Message Label - From Image */}
            <div className="mb-2">
                <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500">Encoding:</span>
                    <span className="text-xs text-blue-400 font-mono">{encoding} [Bait]</span>
                </div>
            </div>

            {/* Content Tabs and Actions - From Image */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex bg-slate-800 rounded p-1">
                    {['plain', 'html', 'mime'].map((type) => (
                        <label
                            key={type}
                            className={`
                flex items-center gap-2 px-4 py-2 cursor-pointer rounded text-sm
                ${contentType === type ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
              `}
                        >
                            <input
                                type="radio"
                                {...register('contentType')}
                                value={type}
                                className="hidden"
                            />
                            {type === 'mime' ? 'MIME Message' : type.toUpperCase()}
                        </label>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`
              flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors
              ${previewMode ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-300'}
            `}
                    >
                        {previewMode ? <><FiCode /> Edit</> : <><FiEye /> Preview</>}
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-sm hover:bg-slate-700 transition-colors"
                    >
                        Search & Replace
                    </button>
                </div>
            </div>

            {/* Content Editor/Preview */}
            {previewMode && contentType === 'html' ? (
                <div className="w-full bg-white rounded p-4 h-96 overflow-y-auto text-black border border-slate-700">
                    <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
            ) : (
                <>
                    <textarea
                        {...register('body', { required: 'Email content is required' })}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-4 text-white h-96 font-mono text-sm focus:outline-none focus:border-blue-500"
                        placeholder={
                            contentType === 'html'
                                ? "<html><body><h1>Hello World</h1><p>Your email content here...</p></body></html>"
                                : contentType === 'mime'
                                    ? "MIME-Version: 1.0\nContent-Type: multipart/alternative;\n\n--boundary\nContent-Type: text/plain; charset=UTF-8\n\nPlain text version...\n\n--boundary\nContent-Type: text/html; charset=UTF-8\n\n<html>HTML version...</html>\n\n--boundary--"
                                    : "Enter your plain text email content here..."
                        }
                    />
                    {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
                </>
            )}

            {/* MIME Message Section - From Image */}
            {contentType === 'mime' && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">MIME Message Editor</label>
                    <textarea
                        {...register('mimeMessage')}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-4 text-white h-48 font-mono text-xs focus:outline-none focus:border-blue-500"
                        placeholder="Full MIME message with headers..."
                    />
                </div>
            )}
        </div>
    );
};

const Step5 = () => {
    const { register, watch, formState: { errors } } = useFormContext();
    const values = watch();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 5: Review & Send</h2>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Campaign Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-400 block">Campaign Name</span>
                        <span className="text-white">{values.name || 'Not set'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">Valid Recipients</span>
                        <span className="text-green-400 font-bold">{values.recipientStats?.valid || 0}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">From</span>
                        <span className="text-white">{values.senderName || 'Not set'} &lt;{values.fromEmail || 'Not set'}&gt;</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">Subject</span>
                        <span className="text-white">{values.subject || 'Not set'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">Email Format</span>
                        <span className="text-white uppercase">{values.contentType || 'html'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400 block">Character Encoding</span>
                        <span className="text-white font-mono">{values.encoding || 'UTF-8'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Schedule Send (Optional)</label>
                    <input
                        type="datetime-local"
                        {...register('scheduleDate')}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white appearance-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Throttling (Emails/Hour)</label>
                    <input
                        type="number"
                        min="1"
                        {...register('throttle', { min: { value: 1, message: 'Minimum 1' } })}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                        defaultValue="100"
                    />
                </div>
            </div>

            {/* Test Send Option */}
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded">
                <h4 className="text-white font-medium mb-2">Test Send</h4>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="test@example.com"
                        className="flex-grow bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    />
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                        Send Test
                    </button>
                </div>
            </div>

            <div className="flex gap-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
                <FiSend className="text-blue-400 text-xl mt-1" />
                <div>
                    <h4 className="text-blue-200 font-medium">Ready to Launch?</h4>
                    <p className="text-blue-400/80 text-sm">
                        Review all settings above. Once you click "Launch Campaign", the process will start immediately or at the scheduled time.
                    </p>
                </div>
            </div>
        </div>
    );
};

const steps = [
    { number: 1, title: 'Campaign Setup', fields: ['name'] },
    { number: 2, title: 'Recipients', fields: ['recipientStats', 'recipientsText'] },
    { number: 3, title: 'Sender Details', fields: ['fromEmail', 'subject', 'replyTo'] },
    { number: 4, title: 'Content', fields: ['body'] },
    { number: 5, title: 'Review & Send', fields: [] }
];

const CampaignForm = () => {
    const navigate = useNavigate();
    const [createCampaign, { isLoading }] = useCreateCampaignMutation();
    const [currentStep, setCurrentStep] = useState(1);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            template: '',
            recipientsText: '',
            recipientStats: { total: 0, valid: 0, invalid: 0, duplicates: 0 },
            senderName: '',
            senderNameEncoding: 'reset',
            fromEmail: '',
            replyTo: '',
            subject: '',
            subjectEncoding: 'reset',
            encoding: 'UTF-8',
            transferEncoding: '8bit',
            customHeaders: '',
            contentType: 'html',
            body: '',
            mimeMessage: '',
            scheduleDate: '',
            throttle: 100,

            // Settings dropdown fields
            dataFile: '',
            totalSend: 0,
            limitToSend: 0,
            sleepTime: 0,
            offerId: '',
            templateName: '',
            domain: '',
            waitTime: 0,
            messageId: '',
            replyToSetting: '',
            xmailer: '',
            replyToEnabled: 'no',

            // Space Sending dropdown fields
            spaceSendingEnabled: false,
            spaceLimitToSend: 0,
            spaceSleepTime: 0,
            spaceOfferId: '',
            spaceTemplateName: '',
            spaceDomain: '',
            spaceWaitTime: 0,
            spaceMessageId: '',
            spaceReplyTo: '',
            spaceXmailer: '',
            spaceXmailer2: '',
            spaceSending: 'no',
        }
    });
    const { trigger, handleSubmit } = methods;

    const handleNext = async () => {
        const step = steps.find(s => s.number === currentStep);
        const isValid = await trigger(step.fields);

        if (isValid) {
            if (currentStep === 2) {
                const stats = methods.getValues('recipientStats');
                if (!stats || stats.valid === 0) {
                    methods.setError('recipientStats', {
                        type: 'manual',
                        message: 'Please add at least one valid recipient'
                    });
                    return;
                }
            }
            setCurrentStep(prev => Math.min(prev + 1, 5));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data) => {
        try {
            await createCampaign(data).unwrap();
            toast.success('Campaign created successfully!');
            navigate('/campaigns');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create campaign. Please try again.');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            case 4: return <Step4 />;
            case 5: return <Step5 />;
            default: return <Step1 />;
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-5xl mx-auto pb-20">
                {/* Wizard Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Create New Campaign</h1>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0 rounded"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 rounded transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>
                        <div className="relative z-10 flex justify-between">
                            {steps.map((step) => (
                                <div key={step.number} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300
                      ${currentStep >= step.number ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}
                    `}
                                    >
                                        {currentStep > step.number ? <FiCheck /> : step.number}
                                    </div>
                                    <span
                                        className={`
                      text-xs font-medium
                      ${currentStep >= step.number ? 'text-blue-400' : 'text-slate-600'}
                    `}
                                    >
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <Card className="min-h-[400px] shadow-2xl border-slate-800 bg-[#1e2329]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {renderStep()}
                    </form>
                </Card>

                {/* Navigation Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-50">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`
                flex items-center gap-2 px-6 py-2 rounded font-medium transition-colors
                ${currentStep === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
                        >
                            <FiChevronLeft />
                            Back
                        </button>

                        <div className="flex gap-4">
                            {currentStep === 5 ? (
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit(onSubmit)}
                                    isLoading={isLoading}
                                    className="bg-green-600 hover:bg-green-700 px-8"
                                >
                                    Launch Campaign
                                    <FiSend className="ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8"
                                >
                                    Next Step
                                    <FiChevronRight className="ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default CampaignForm;