import React, { useCallback, useEffect, useRef, useState } from 'react'
import './notificationIcon.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import { handleApiError, rateLimiter } from '../../functions/requestUtils'
export default function NotificationIcon({ token, fireNotification, setFireNotification }) {
    const loginType = localStorage.getItem('loginType');
    const [showNotifications, setShowNotifications] = useState(false);
    const [unAuth, setUnAuth] = useState(false);
    const [notsItems, setNotsItems] = useState([]);
    const [notsCount, setNotsCount] = useState(0)
    const notificationRef = useRef(null);
    const iconRef = useRef(null);
    const navigate = useNavigate()
    const handleNavigation = (target, id) => {
        if (target === 'booked_appointments') {
            navigate(`/profile/booked-appointments`);
        } else if (target === 'one_click_quotation') {
            navigate(`/profile/companyoneclick-quotations/${id}`);
        } else if (target === 'quotation') {
            navigate(`/profile/quotations/${id}`);
        } else if (target === 'quotation_order') {
            navigate(`/profile/quotation-orders/${id}`);
        } else if (target === 'followers') {
            console.log('Navigating to /profile/followers');
            navigate(`/profile/followers`);
        }else if (target === 'new_industry') {
            navigate(`/show-company/${id}`);
        }
         else {
            console.warn(`Unhandled target: ${target}`);
        }
        setShowNotifications(false);
    };
    const toggleNotifications = () => {
        setShowNotifications(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notificationRef, iconRef]);

    const getLatestNotifications = useCallback(() => {
        (async () => {
            if (token) {
                const slug = loginType === 'user' ? `${loginType}/latest-notifications`
                    :
                    `${loginType}/company-latest-notifications`
                try {
                    const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setNotsItems(response?.data?.data?.notifications);
                    setNotsCount(response?.data?.data?.count);
                } catch (error) {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(error?.response?.data?.message || 'Something Went Wrong!');
                }
                setFireNotification(false);
            };
        })();
    }, [fireNotification])

    const markLatestRead = async () => {
        // Apply rate limiting
        if (!rateLimiter('markLatestRead')) {
            toast.error('You are taking actions too quickly. Please wait a moment.');
            return;
        }

        const slug = loginType === 'user' ? `${loginType}/mark-latest-read` : `${loginType}/company-mark-latest-read`;
        try {
            await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotsCount(0);
        } catch (error) {
            handleApiError(error, setUnAuth); // Use centralized error handling
        }
    };





    // window.onscroll = () => {
    //     if (showNotifications === true) {
    //         setShowNotifications(false);
    //     };
    // };

    useEffect(() => {
        getLatestNotifications();
    }, [loginType, token, fireNotification]);


    return (
        <div className='notificationIcon__handler'>
            {
                notsCount !== 0 && (
                    <div className="notificationCount__num">
                        {notsCount}
                    </div>
                )
            }

            <div className="iconItemBox">
                <i ref={iconRef} className="bi bi-bell-fill"
                    onClick={() => {
                        toggleNotifications();
                        markLatestRead();
                    }}></i>
            </div>
            <div
                ref={notificationRef}
                className={`notficationBody__handler ${showNotifications ? 'show' : 'hide'}`}
            >
                <div className="notHeaderBox">
                    <h3>
                        Notifications
                    </h3>
                </div>
                <div className="NotsItems_Box">
                    {notsItems?.length !== 0 ?
                        <>
                            {
                                notsItems?.map((el, idx) => (
                                    <div

                                        key={idx}
                                        className="notItem d-flex align-items-center gap-2"
                                        onClick={(event) => {
                                            console.log('Clicked:', el);
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handleNavigation(el?.target, el?.sender_id);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={el?.image} alt="" />
                                        <div className="itemInfo">
                                            <h5>
                                                {el.title}
                                            </h5>
                                            <p>
                                                {el?.message}
                                            </p>
                                            
                                        </div>
                                        
                                    </div>
                                ))
                            }
                        </>
                        :
                        <p className='mt-4'>
                            there no new notifications!
                        </p>
                    }
                    <NavLink to={'/profile/notifications'} className={'nav-link'}>
                        <button className='viewMoreNotfiBtn' >
                            view more
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}
