import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../services/firebase';

export const useNotifications = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Request permission on mount (optional, better to do on user action)
        // requestNotificationPermission();

        const unsubscribe = onMessageListener().then((payload) => {
            setNotification({
                title: payload.notification.title,
                body: payload.notification.body,
            });
            // Clear notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        });

        // In a real implementation with onMessage, you'd handle cleanup differently 
        // as onMessage returns an unsubscribe function directly in newer SDKs
    }, []);

    return { notification };
};
