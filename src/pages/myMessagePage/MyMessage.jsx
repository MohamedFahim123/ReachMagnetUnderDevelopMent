import React, { useEffect, useState } from 'react';
import './myMessage.css';
import UserChatSidebar from '../../components/userChatSidebarMainSec/UserChatSidebar';
import MessageChatScreen from '../../components/messageChatScreenSec/MessageChatScreen';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function MyMessage({getAllChats, setError,chats,userNowInfo, token, fireMessage, setFireMessage }) {
    const loginType = localStorage.getItem('loginType');
    const [loading, setLoading] = useState(true);
    const { activeChatId } = useParams();
    const [activeChat, setActiveChat] = useState(activeChatId);
    const [messages, setMessages] = useState([]);
    const [chatSettings, setChatSettings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingActiveChat, setLoadingActiveChat] = useState(false);
    const navigate = useNavigate();
    const [firstRender, setFirstRender] = useState(true);



    const showActiveChat = async (page = 1) => {
        setLoadingActiveChat(true);
        try {
            const res = await axios.get(`${baseURL}/${loginType}/get-chat/${activeChatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    t: new Date().getTime()
                },
            });
            const newMessages = res?.data?.data?.messages.messages;
            setChatSettings(res?.data?.data?.chat)
            setMessages((prevMessages) => page === 1 ? newMessages : [...prevMessages, ...newMessages]);
            setHasMore(res?.data?.data?.messages?.meta?.current_page < res?.data?.data?.messages?.meta?.last_page);
            getAllChats();
            setCurrentPage(page);
            setFireMessage(false);
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoadingActiveChat(false);
        };
    };

    const newChatId = Cookies.get('newChatId');
    useEffect(() => {
        if (firstRender) {
            navigate('/your-messages');
            setFirstRender(false);
        };
    }, []);

    useEffect(() => {
        if (newChatId) {
            navigate(`/your-messages/${newChatId}`);
            Cookies.remove('newChatId');
        }
    }, [newChatId]);

    useEffect(() => {
        if (activeChatId && token) {
            showActiveChat();
        };
    }, [fireMessage, activeChatId, token]);

    useEffect(() => {
        if (token && loginType) {
            getAllChats();
        };
    }, [token, loginType, fireMessage]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getAllChats();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='myMessage__handler px-5'>
                    <div className="container-fluid">
                        <div className="myMessage__mainContent">
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="userChat__sidebar">
                                        <UserChatSidebar chats={chats} setActiveChat={setActiveChat} userNowInfo={userNowInfo}
                                            activeChatId={activeChatId}
                                        />
                                    </div>
                                </div>
                                {
                                    activeChatId && (
                                        <div className="col-lg-8 col-md-8 col-sm-12">
                                            <MessageChatScreen
                                                loginType={loginType} token={token} messages={messages} activeChat={activeChat}
                                                loadOlderMessages={() => showActiveChat(currentPage + 1)}
                                                hasMore={hasMore}
                                                chatSettings={chatSettings}
                                                loadingActiveChat={loadingActiveChat}
                                                fireMessage={fireMessage}
                                                setFireMessage={setFireMessage}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
