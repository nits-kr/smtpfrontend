import { useEffect, useState } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';

export const useLiveDashboard = () => {
    const [stats, setStats] = useState({
        bulkSent: 0,
        testSent: 0,
        errors: 0,
    });

    const [smtpData, setSmtpData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        connectSocket();

        // Listen for initial data
        socket.on('dashboard:init', (data) => {
            setStats(data.stats);
            setSmtpData(data.smtpData);
            setLoading(false);
        });

        // Listen for live updates
        socket.on('dashboard:update', (update) => {
            // Optimistic update or overwrite logic
            setStats((prev) => ({ ...prev, ...update.stats }));
            if (update.smtpData) {
                setSmtpData(update.smtpData); // In real apps, might want to merge
            }
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.off('dashboard:init');
            socket.off('dashboard:update');
            socket.off('connect_error');
            disconnectSocket();
        };
    }, []);

    return { stats, smtpData, loading };
};
