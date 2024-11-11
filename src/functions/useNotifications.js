import { useRef } from 'react';
import { baseURL } from './baseUrl';
import toast from 'react-hot-toast';
import Pusher from 'pusher-js';

const useNotifications = (token, loginType, loginnedUserId, setFireNotification) => {
    const isEventBound = useRef(false);

    // useEffect(() => {
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

            const channelName = `private-user-notification-${loginType === 'user' ? 'User' : 'Employee'}${loginnedUserId}`;
            const channel = pusher.subscribe(channelName);

            if (!isEventBound.current) {
                channel.bind('user-notification-event', (data) => {
                    
                    if (data && data.length > 0) {
                        toast.success(`${data[0]?.title}\n${data[0]?.body}`, {
                            duration: 3000,
                        });
                    } else {
                        toast.success('New notification received!', {
                            duration: 3000,
                        });
                    }
                    setFireNotification(true);
                });
                isEventBound.current = true;
            }

            // return () => {
            //     channel.unbind_all();
            //     channel.unsubscribe();
            //     pusher.disconnect();
            //     isEventBound.current = false;
            // };
        }
    // }, [token, loginType, loginnedUserId]);
};

export default useNotifications;