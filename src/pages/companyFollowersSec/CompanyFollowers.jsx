import React, { useEffect, useState } from 'react'
import './companyFollowers.css'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec'

export default function CompanyFollowers({ loginType, token }) {
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [followed, setFollowed] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeRole, setActiveRole] = useState('Followers');


    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    // useEffect(() => {
    //     if (token) {
    //         const slugCompletion = loginType === 'user' ? 'user/followed-companies' : ('employee/company-followers');
    //         const fetchData = async () => {
    //             try {
    //                 const response = await axios.get(`${baseURL}/${slugCompletion}?page=${currentPage}?t=${new Date().getTime()}`, {
    //                     headers: {
    //                         'Accept': 'application/json',
    //                         'Authorization': `Bearer ${token}`,
    //                     },
    //                 });
    //                 if (loginType === 'user') {
    //                     setFollowers(response?.data?.data?.followedCompanies);
    //                 } else if (loginType === 'employee') {
    //                     setFollowers(response?.data?.data?.followers);
    //                     setFollowed(response?.data?.data?.followedCompanies);
    //                 };
    //                 setTotalPages(response?.data?.data?.meta?.last_page);
    //             } catch (error) {
    //                 if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
    //                     setUnAuth(true);
    //                 };
    //                 toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
    //             };
    //         };
    //         fetchData();
    //     };
    // }, []);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    let followersData = [], followedData = [];

                    if (loginType === 'user') {
                        const response = await axios.get(`${baseURL}/user/followed-companies?page=${currentPage}&t=${new Date().getTime()}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        followersData = response?.data?.data?.followedCompanies;
                    } else if (loginType === 'employee') {
                        const [followersResponse, followedResponse] = await Promise.all([
                            axios.get(`${baseURL}/employee/company-followers?page=${currentPage}&t=${new Date().getTime()}`, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                            }),
                            axios.get(`${baseURL}/employee/followed-companies?page=${currentPage}&t=${new Date().getTime()}`, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                            })
                        ]);
                        followersData = followersResponse?.data?.data?.followers;
                        followedData = followedResponse?.data?.data?.followedCompanies;
                    }

                    setFollowers(followersData);
                    setFollowed(followedData);
                    // setTotalPages(response.data?.data?.meta?.last_page || 1);
                } catch (error) {
                    if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                        setUnAuth(true);
                    };
                    toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                };
            };
            fetchData();
        };
    }, [currentPage, token, loginType]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    const updatedFollowersAndFollowing = loginType === 'user'
        ?
        followers?.filter((el, index, self) =>
            index === self.findIndex((t) => t.companyId === el.companyId)
        )
        :
        followers?.filter((el, index, self) =>
            index === self.findIndex((t) => t.userId === el.userId)
        )
        console.log(followed);
        
    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler company__follower__sec'>
                                        <ContentViewHeader title={`${loginType === 'user' ? 'All Following' : 'All Followers'}`} />
                                        <div className="follower__filter__search">
    <div className='followerInfo__handler row'>
        {
            loginType !== 'user' &&
            <div className="col-12 mb-4">
                    <div className="my__roles__actions">
                        <button
                            className={`def__btn ${activeRole === 'Followers' ? 'rolesActiveBtn' : ''}`}
                            onClick={() => setActiveRole('Followers')}
                        >
                            Followers
                        </button>
                        <button
                            className={`cust__btn ${activeRole === 'Followed Companies' ? 'rolesActiveBtn' : ''}`}
                            onClick={() => setActiveRole('Followed Companies')}
                        >
                            Followed Companies
                        </button>
                    </div>
            </div>
        }
        {
            loginType !== 'user' &&
            activeRole === 'Followed Companies' &&
            followed?.map((el) => {
                return (
                    <div key={el?.id} className="followerInfo__Item col-12">
                        <div className="followerImage">
                            <img src={el?.companyLogo
                            } alt={`${el?.companyName} avatar`} />
                        </div>
                        <div className="followerContactInfo">
                            <h1>
                                {el?.companyName}
                            </h1>
                            <div className="follower__status">
                                
                                <p className='isUsersfollowed'>
                                    following
                                </p>
                            </div>

                        </div>
                    </div>
                )
            })
        }
        {
            loginType !== 'user' &&
            activeRole === 'Followers' && 
            updatedFollowersAndFollowing?.map((el) => {
                return (
                    <div key={el?.id} className="followerInfo__Item col-12">
                        <div className="followerImage">
                            <img src={el?.followableImage 
                            } alt={`${el?.followableName} avatar`} />
                        </div>
                        <div className="followerContactInfo">
                            <h1>
                                {el?.followableName }
                            </h1>
                            <div className="follower__status">
                                <p>
                                    {el?.followableEmail || ''}
                                </p>
                                <p className='isUsersfollowed'>
                                    follows you
                                </p>
                            </div>

                        </div>
                    </div>
                )
            })
        }
        { loginType !=='employee' &&
            updatedFollowersAndFollowing?.map((el) => {
                return (
                    <div key={el?.id} className="followerInfo__Item col-12">
                        <div className="followerImage">
                            <img src={el?.followableImage || el?.companyLogo
                            } alt={`${el?.userName || el?.companyLogo} avatar`} />
                        </div>
                        <div className="followerContactInfo">
                            <h1>
                                {el?.followableName || el?.companyName}
                            </h1>
                            <div className="follower__status">
                                <p>
                                    {el?.followableEmail || ''}
                                </p>
                                <p className='isUsersfollowed'>
                                    following
                                </p>
                            </div>

                        </div>
                    </div>
                )
            })
        }
        <div className="col-lg-12">
            {
                totalPages > 1 &&
                <div className="d-flex justify-content-center align-items-center mt-4">
                    <button
                        type="button"
                        className="paginationBtn me-2"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <i class="bi bi-caret-left-fill"></i>
                    </button>
                    <span className='currentPagePagination'>{currentPage}</span>
                    <button
                        type="button"
                        className="paginationBtn ms-2"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <i class="bi bi-caret-right-fill"></i>
                    </button>
                </div>
            }
        </div>
    </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};