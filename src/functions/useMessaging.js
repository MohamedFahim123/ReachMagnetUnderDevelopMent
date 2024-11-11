import Pusher from 'pusher-js';
import { useRef } from 'react';
import { baseURL } from './baseUrl';
import toast from 'react-hot-toast';

export default function useMessaging(token, loginType, loginnedUserId, setFireMessage) {
    const isEventBound = useRef(false);
    if (token && loginType && loginnedUserId) {
        const pusher = new Pusher('1895ae2554ec9f2efb30', {
            cluster: 'ap2',
            authEndpoint: `${baseURL}/user/pusher/auth`,
            auth: {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });
        Pusher.logToConsole = false;
        const channelName = `private-chat-notification-${loginType === 'user' ? 'User' : 'Employee'}${loginnedUserId}`;
        const channel = pusher.subscribe(channelName);
        if (!isEventBound.current) {
            channel.bind('chat-notification-event', (data) => {
                toast.success(`${data?.body}`);
                console.log(data);
                setFireMessage(true);
            });
            isEventBound.current = false;
        };
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    };
};