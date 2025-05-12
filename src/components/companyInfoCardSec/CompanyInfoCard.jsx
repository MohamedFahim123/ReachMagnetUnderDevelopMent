import React, { useState } from 'react'
import './companyInfoCard.css'
import verfuIcon from '../../assets/companyImages/Vector (3).png'
import callIcon from '../../assets/companyImages/call.svg'
import messageIcon from '../../assets/companyImages/messages-3.svg'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'
import { scrollToTop } from '../../functions/scrollToTop';
import Cookies from 'js-cookie';

export default function CompanyInfoCard({ handleShow, showCompaniesQuery, token }) {
    const [error, setError] = useState(null);
    const loginType = localStorage.getItem('loginType')
    const [currentFollowedCompanies, setCurrentFollowedCompanies] = useState(() => {
        const cookieValue = Cookies.get('CurrentFollowedCompanies');
        return cookieValue ? JSON.parse(cookieValue) : [];
    });
    const navigate = useNavigate();

    const handleToggleFollowCompany = async (id) => {
        const currentCompanyWantedToFollow = {
            company_id: `${id}`
        };
        const toastId = toast.loading('loading...');
        const slug = loginType === 'user' ? 'user/control-follow-company' : 'employee/control-follow'
        await axios.post(`${baseURL}/${slug}?t=${new Date().getTime()}`,
            currentCompanyWantedToFollow,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            .then(response => {
                Cookies.set('CurrentFollowedCompanies', JSON.stringify([...response?.data?.data?.followedCompanies]), { expires: 999999999999999999999999999999 * 99999999999999999999999999999999999 * 99999999999999999999999999999999 });
                setCurrentFollowedCompanies([...response?.data?.data?.followedCompanies]);
                toast.success(`${response?.data?.message}`, {
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(() => {
                toast.error(`Something Went Wrong Please try Again Later!`, {
                    id: toastId,
                    duration: 1000
                });
            });
    };


    const startNewChat = async (receiverId, receiverType) => {
        try {
            const res = await axios.post(`${baseURL}/${loginType}/start-chat`, {
                'receiever_type': receiverType,
                'receiever_id': `${receiverId}`
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    t: new Date().getTime()
                },
            });
            // navigate(`/your-messages/${res?.data?.data?.chat?.id}`)
            Cookies.set('newChatId', res?.data?.data?.chat?.id)
            navigate(`/your-messages`)

        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load messages');
        }
    };

    // const handleNavigation = () => {
    //     if (showCompaniesQuery?.chatId === null && token) {
    //         startNewChat(showCompaniesQuery?.receiver_id, showCompaniesQuery?.receiver_type);

    //     }else if(!token){
    //         navigate(`/login`)
    //     }
    //      else {
    //         Cookies.set('newChatId', showCompaniesQuery?.chatId )
    //         navigate(`/your-messages`);

    //     }
    // };

    const handleNavigation = () => {
        const loginType = localStorage.getItem('loginType');
        const isVerified = Cookies.get('verified') === 'true';

        if (!token) {
            toast.error('You should log in first!');
            navigate(`/login`);
        } else if (loginType === 'user' && !isVerified) {
            toast.error('You need to verify your account first!');
            setTimeout(() => {
                navigate('/user-verification');
            }, 1000);
        } else if (showCompaniesQuery?.chatId === null) {
            startNewChat(showCompaniesQuery?.receiver_id, showCompaniesQuery?.receiver_type);
        } else {
            Cookies.set('newChatId', showCompaniesQuery?.chatId);
            navigate(`/your-messages`);
        }
    };

    const [expandedText, setExpandedText] = useState({
        address: false,
        type: false,
    });

    const toggleText = (field) => {
        setExpandedText((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };
console.log(showCompaniesQuery);

    return (
        <div className='container'>
            <div className="companyInfoCard__handler">
                <div className="row">
                    <div className="col-lg-3 col-md-12 center__on__mobile">
                        <div className="company__profile__img">
                            <img src={showCompaniesQuery?.companyLogo} alt="profile" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 ">
                        <div className="company__name">
                            <h1>
                                {showCompaniesQuery?.companyName}
                            </h1>
                            <span>
                                {showCompaniesQuery?.can_book_with_company === true ? 
                                <p style={{backgroundColor:'#e8e8e8', padding:'2px 5px', borderRadius:'5px', textTransform:'capitalize', color:'#8c64ee'}}>
                                    premuim
                                </p>
                                :
                                <img src={verfuIcon} alt="icon" />
                            }
                                

                            </span>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    {/* <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Address:
                                        </p>
                                        <p className='companyinfo__subTit cursorPointer' title={showCompaniesQuery?.companyFullAddress}>
                                            {showCompaniesQuery?.companyFullAddress?.length >= 25 ? showCompaniesQuery?.companyFullAddress?.slice(0, 25) + '...' : showCompaniesQuery?.companyFullAddress}
                                        </p>
                                    </div> */}
                                    <div className={`company__boxInfo ${expandedText.address === true ? 'isExpendedMarginB' : ''}`}>
                                        <p className='companyinfo__Tit'>Address:</p>
                                        <p className={`companyinfo__subTit cursorPointer `} title={`
                                        ${showCompaniesQuery?.companyBranches[0]?.branchCity},
                                        ${showCompaniesQuery?.companyBranches[0]?.branchCountry}
                                        `}
                                        >
                                            {`
                                            ${showCompaniesQuery?.companyBranches[0]?.branchCity},
                                            ${showCompaniesQuery?.companyBranches[0]?.branchCountry}
                                            `}
                                            {/* {expandedText.address || showCompaniesQuery?.companyFullAddress?.length <= 20
                                            ? showCompaniesQuery?.companyFullAddress
                                            : showCompaniesQuery?.companyFullAddress?.slice(0, 20) + '...'}
                                             {showCompaniesQuery?.companyFullAddress?.length > 20 && (
                                            <span className="read-more-btn" onClick={() => toggleText('address')}>
                                            {expandedText.address ? 'Read Less' : 'Read More'}
                                            </span>
                                            )} */}
                                        </p>

                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            Verification Status:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyRegisterationStatus}
                                        </p>
                                    </div>
                                    <div className="company__actions">
                                        <button className='btn__companyActions Showbtn__companyActions'>
                                            <NavLink to={`tel:${showCompaniesQuery?.companyBranches[0]?.branchFullPhoneOne}`}>
                                                <img src={callIcon} alt="call-icon" />
                                            </NavLink>
                                        </button>
                                        <button className='btn__companyActions hidebtn__companyActions'>
                                            <NavLink className='nav-link' to={`tel:${showCompaniesQuery?.companyBranches[0]?.branchFullPhoneOne}`}>
                                                <p   
                                                style={{color:'#4f2d7f'}}
                                                className='companyinfo__subTit' >
                                                    {showCompaniesQuery?.companyBranches[0]?.branchFullPhoneOne}
                                                </p>
                                            </NavLink>
                                        </button>
                                        { showCompaniesQuery?.can_chat &&
                                            <button onClick={handleNavigation} className='btn__companyActions online__btn'>
                                            <NavLink className={'nav-link'}
                                            >
                                                <img src={messageIcon} alt="message-icon" />
                                            </NavLink>
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            industry:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyIndustries[0]?.industryName}
                                        </p>
                                    </div>
                                    <div className="company__boxInfo">
                                        <p className='companyinfo__Tit'>
                                            founded:
                                        </p>
                                        <p className='companyinfo__subTit'>
                                            {showCompaniesQuery?.companyFounded}
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <div className="col-lg-4 col-md-4 padding__on__md__screen">
                                <div className="companyBoxItem">
                                    <div className={`company__boxInfo ${expandedText.type === true ? 'isExpendedMarginB' : ''}`}>
                                        <p className='companyinfo__Tit'>
                                            type:
                                        </p>
                                        <p className='companyinfo__subTit cursorPointer' title={showCompaniesQuery?.companyTypes[0]?.type}>
                                            {expandedText.type || showCompaniesQuery?.companyTypes[0]?.type?.length <= 15
                                                ? showCompaniesQuery?.companyTypes[0]?.type
                                                : showCompaniesQuery?.companyTypes[0]?.type?.slice(0, 15) + '...'}
                                            {showCompaniesQuery?.companyTypes[0]?.type?.length > 15 && (
                                                <span className="read-more-btn" onClick={() => toggleText('type')}>
                                                    {expandedText.type ? 'Read Less' : 'Read More'}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {/* <div className="company__boxInfo mt-2">
                                        <div className="companyFollow__btn">
                                            {
                                                (token) ?
                                                    (currentFollowedCompanies) ?
                                                        currentFollowedCompanies?.find(el => +el?.companyId === +showCompaniesQuery?.companyId) ?
                                                            <button
                                                                className='pageMainBtnStyle unFollowCompanyBtn'
                                                                onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                            >
                                                                unFollow
                                                            </button>
                                                            :
                                                            <button
                                                                className='pageMainBtnStyle followCompanyBtn'
                                                                onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                            >
                                                                + follow
                                                            </button>
                                                        : ''
                                                    :
                                                    <button
                                                        className='pageMainBtnStyle followCompanyBtn'
                                                        onClick={() => {
                                                            toast.error(`${(!token) && 'You Should Login First!'}`);
                                                            setTimeout(() => {
                                                                navigate('/login');
                                                                scrollToTop();
                                                            }, 1000);
                                                        }}
                                                    >
                                                        + follow
                                                    </button>
                                            }
                                        </div>
                                    </div> */}
                                    <div className="company__boxInfo mt-2">
                                        <div className="companyFollow__btn">
                                            {
                                                token ? (
                                                    // Check if loginType is 'user' and verified
                                                    localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                        <button
                                                            className='pageMainBtnStyle followCompanyBtn'
                                                            onClick={() => {
                                                                toast.error('You need to verify your account first!');
                                                                setTimeout(() => {
                                                                    navigate('/user-verification');
                                                                    scrollToTop();
                                                                }, 1000);
                                                            }}
                                                        >
                                                            + follow
                                                        </button>
                                                    ) : (
                                                        currentFollowedCompanies ? (
                                                            currentFollowedCompanies.find(el => +el?.companyId === +showCompaniesQuery?.companyId) ? (
                                                                <button
                                                                    className='pageMainBtnStyle unFollowCompanyBtn'
                                                                    onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                                >
                                                                    unFollow
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className='pageMainBtnStyle followCompanyBtn'
                                                                    onClick={() => handleToggleFollowCompany(+showCompaniesQuery?.companyId)}
                                                                >
                                                                    + follow
                                                                </button>
                                                            )
                                                        ) : ''
                                                    )
                                                ) : (
                                                    <button
                                                        className='pageMainBtnStyle followCompanyBtn'
                                                        onClick={() => {
                                                            toast.error('You should log in first!');
                                                            setTimeout(() => {
                                                                navigate('/login');
                                                                scrollToTop();
                                                            }, 1000);
                                                        }}
                                                    >
                                                        + follow
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                        <div className="companyQutation__btn">
                            { showCompaniesQuery?.can_make_quotation &&
                                <>
                                    {
                                        token ? (
                                            localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                <button
                                                    className='btnColoredBlue'
                                                    onClick={() => {
                                                        toast.error('You need to verify your account first!');
                                                        setTimeout(() => {
                                                            navigate('/user-verification');
                                                            scrollToTop();
                                                        }, 1000);
                                                    }}
                                                >
                                                    Request Quotation
                                                </button>
                                            ) : (
                                                <NavLink
                                                    onClick={() => {
                                                        scrollToTop();
                                                        Cookies.set('currentCompanyRequestedQuote', showCompaniesQuery?.companySlug);
                                                    }}
                                                    className='nav-link'
                                                    to={`/${showCompaniesQuery?.companyName}/request-quote`}
                                                >
                                                    <button className='btnColoredBlue'>
                                                        Request Quotation
                                                    </button>
                                                </NavLink>
                                            )
                                        ) : (
                                            <NavLink
                                                onClick={() => {
                                                    toast.error('You Should Login First!');
                                                    scrollToTop();
                                                }}
                                                className='nav-link'
                                                to={`/login`}
                                            >
                                                <button className='btnColoredBlue'>
                                                    Request Quotation
                                                </button>
                                            </NavLink>
                                        )
                                    }
                                </>
                            }
                            { showCompaniesQuery?.can_book_with_company &&
                                <>
                                    {
                                        token ? (
                                            localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                <button
                                                    className='btnColoredBlue terquase mt-3'
                                                    onClick={() => {
                                                        toast.error('You need to verify your account first!');
                                                        setTimeout(() => {
                                                            navigate('/user-verification');
                                                            scrollToTop();
                                                        }, 1000);
                                                    }}
                                                >
                                                    Book Appointment
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleShow}
                                                    className='btnColoredBlue terquase mt-3'
                                                >
                                                    Book Appointment
                                                </button>
                                            )
                                        ) : (
                                            <NavLink
                                                onClick={() => {
                                                    toast.error('You Should Login First!');
                                                    scrollToTop();
                                                }}
                                                className='nav-link'
                                                to={`/login`}
                                            >
                                                <button className='btnColoredBlue terquase mt-3'>
                                                    Book Appointment
                                                </button>
                                            </NavLink>
                                        )
                                    }
                                </>
                            }

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
