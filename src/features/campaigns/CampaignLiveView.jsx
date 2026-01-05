import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../services/socket';

const CampaignLiveView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        sent: 0,
        received: 0,
        inbox: 0,
        spam: 0,
    });
    const logsEndRef = useRef(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    useEffect(() => {
        // Connect socket if not already connected
        if (!socket.connected) {
            socket.connect();
        }

        const handleProgress = (data) => {
            console.log("🔥 Socket Event Received:", data); // Debug log
            console.log("Current Page ID:", id); // Debug log

            if (data.campaignId && data.campaignId !== id) {
                console.warn(`Mismatch: Event ID ${data.campaignId} !== Page ID ${id}`);
                return;
            }

            setStats(prevStats => {
                const newStats = { ...prevStats };
                newStats.sent += 1;

                if (data.status === 'completed') {
                    newStats.received += 1;
                    newStats.inbox += 1; // Assumption for demo
                }

                // Add log with SNAPSHOT of new stats
                const logEntry = {
                    ...data,
                    snapshotStats: { ...newStats }
                };

                setLogs(prevLogs => [...prevLogs, logEntry]);

                return newStats;
            });
        };

        socket.on('campaign-progress', handleProgress);

        return () => {
            socket.off('campaign-progress', handleProgress);
        };
    }, [id]);

    // Format timestamp
    const formatTime = (isoString) => {
        if (!isoString) return new Date().toLocaleTimeString();
        return new Date(isoString).toLocaleTimeString();
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex flex-col mb-2">
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white text-black px-3 py-1 text-sm font-bold rounded-sm hover:bg-gray-200"
                    >
                        Go Back
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold tracking-wider text-green-600">{id || 'Unknown Campaign'}</h1>
                    <div className="w-20"></div>
                </div>
                <div className="w-full h-px bg-white/20 mb-4"></div>
            </div>

            {/* Terminal Output Area */}
            <div className="flex-1 overflow-y-auto bg-black p-2 font-mono text-xs md:text-sm leading-relaxed scrollbar-hide">
                <div className="text-green-600 space-y-1">
                    <div>Checking Inbox Status and Matching Percentage ..! GIVEN : 100%</div>
                    <div>Test Email Sent SucessFully..!</div>
                    <div>Checking Test Email Sent Status..!</div>
                    <div>sent successfully to 2 Subscribers out of 2</div>
                    <div>Auto Sending Started with {id}..!</div>
                </div>

                {logs.length === 0 && (
                    <div className="mt-4 text-green-800 animate-pulse">Waiting for server stream...</div>
                )}

                <div className="mt-2 space-y-1">
                    {logs.map((log, index) => (
                        <div key={index} className="whitespace-nowrap break-all hover:bg-white/5">
                            <span className="text-green-500 font-semibold">Total Mail Sent : {log.snapshotStats.sent}</span>
                            <span className="mx-1 text-green-700">||</span>
                            <span className="text-green-500 font-semibold">Total Mail Recieved : {log.snapshotStats.received}</span>
                            <span className="mx-1 text-green-700">||</span>
                            <span className="text-green-500 font-semibold">INBOX : {log.snapshotStats.inbox}</span>
                            <span className="mx-1 text-green-700">||</span>
                            <span className="text-green-500 font-semibold">SPAM : {log.snapshotStats.spam}</span>
                            <span className="mx-1 text-green-700">||</span>
                            <span className="text-green-500">MAIL STATUS : </span>
                            <span className="text-green-400">{log.email}</span>
                            <span className="mx-1"></span>
                            <span className={log.status === 'completed' ? 'text-green-500' : 'text-red-500'}>
                                {log.status === 'completed' ? '1' : '0'}
                            </span>
                            <span className="text-sm mx-1">|</span>
                            {/* Mocking the additional columns from image roughly */}
                            <span className="text-green-600">sidharthsidh025@yahoo.com 3</span>
                            <span className="mx-1 text-green-700">||</span>
                            <span className="text-green-500">Inbox Percentage : {log.status === 'completed' ? '33.333' : '0'}%</span>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>

            {/* DEBUG / SIMULATION CONTROLS */}
            <div className="fixed bottom-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => {
                        console.log("Simulating event...");
                        const mockData = {
                            campaignId: id,
                            status: Math.random() > 0.8 ? 'failed' : 'completed',
                            email: `simulated_${Math.floor(Math.random() * 1000)}@example.com`,
                            error: null,
                            timestamp: new Date().toISOString()
                        };
                        // Manually trigger the handler
                        // We can't easily trigger the socket event listener directly from here without emitting to server,
                        // so we'll just call a logic wrapper or expose the setter.
                        // Actually, let's just emit a loop of local state updates for visual proof.

                        // We need access to the handler or state setter.
                        // Since handler is inside useEffect, let's just duplicate logic here for the 'Simulate' button purely for UI check.

                        const data = mockData;
                        setStats(prevStats => {
                            const newStats = { ...prevStats };
                            newStats.sent += 1;
                            if (data.status === 'completed') {
                                newStats.received += 1;
                                newStats.inbox += 1;
                            }
                            const logEntry = { ...data, snapshotStats: { ...newStats } };
                            setLogs(prevLogs => [...prevLogs, logEntry]);
                            return newStats;
                        });
                    }}
                    className="bg-gray-800 text-xs text-white px-2 py-1 rounded border border-gray-600"
                >
                    [DEBUG] Simulate Event
                </button>
            </div>
        </div>
    );
};

export default CampaignLiveView;
