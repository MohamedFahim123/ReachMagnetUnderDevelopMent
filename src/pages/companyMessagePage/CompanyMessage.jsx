import React, { useEffect, useState } from 'react'
import './companyMessage.css'
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar'
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen'
import EmployeeChatSidebar from '../../components/employeeChatSidebarMainSec/EmployeeChatSidebar'
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function CompanyMessage({token}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     const pusher = new Pusher('9b5d478389d4bbf7919c', {
    //         cluster: 'ap2',
    //         authEndpoint: `${baseURL}/user/pusher/auth`,
    //         auth: {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         },
    //     });
    //     Pusher.logToConsole = false;
    //     const channel = pusher.subscribe('');
    //     channel.bind('message', (data) => {
    //         setMessages((prevMessages) => [...prevMessages, data]);
    //     });
    //     return () => {
    //         channel.unbind_all();
    //         channel.unsubscribe();
    //         pusher.disconnect();
    //     };
    // }, []);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='companyMessage__handler myMessage__handler'>
                        <div className="container">
                            <div className="companyMessage__mainContent">
                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                        <UserChatSidebar />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                        <MessageChatScreen />
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-12">
                                        <EmployeeChatSidebar />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
