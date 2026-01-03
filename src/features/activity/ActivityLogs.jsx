import React, { useEffect, useState } from 'react';
import { socket, connectSocket, disconnectSocket } from '../../services/socket';
import Card from '../../components/ui/Card';
import { FiActivity, FiServer, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import moment from 'moment';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        connectSocket();

        socket.on('activity:log', (newLog) => {
            setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
        });

        // Mock initial logs if needed or fetch via API
        setLogs([
            { id: 1, type: 'info', message: 'Campaign "Black Friday" started', timestamp: new Date(), user: 'Admin' },
            { id: 2, type: 'error', message: 'SMTP connection failed on Server 2', timestamp: new Date(Date.now() - 5000), user: 'System' },
            { id: 3, type: 'success', message: 'User "John" registered', timestamp: new Date(Date.now() - 10000), user: 'System' },
        ]);

        return () => {
            socket.off('activity:log');
            disconnectSocket();
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'error': return <FiAlertCircle className="text-red-500" />;
            case 'success': return <FiCheckCircle className="text-green-500" />;
            default: return <FiServer className="text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiActivity /> Live Activity Logs
            </h1>

            <div className="grid gap-4">
                {logs.map((log, index) => (
                    <Card key={log.id || index} className="border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-slate-900 rounded-lg">
                                    {getIcon(log.type)}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{log.message}</p>
                                    <p className="text-sm text-slate-400">User: {log.user}</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">
                                {moment(log.timestamp).format('HH:mm:ss')}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
            {logs.length === 0 && (
                <div className="text-center text-slate-500 py-12">
                    Waiting for real-time activity...
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;
