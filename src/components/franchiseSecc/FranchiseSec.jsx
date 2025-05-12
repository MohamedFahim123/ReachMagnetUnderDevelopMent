import React from 'react';
import './franchiseSec.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function FranchiseSec({ pageName, headText, paraText, btnOneText, btnTwoText, btnOnelink, token }) {
    const navigate = useNavigate();
    return (
        <div className={`franchiseSec__handler`}>
            <div className="container">
                <div className={`${pageName === 'home' ? 'franchiseSec__content' : 'franchiseSec__content franchiseSec__content-two overlay30'} text-center`}>
                    <h3>
                        {headText ? headText : ''}
                    </h3>
                    <p>
                        {paraText ? paraText : ''}
                    </p>
                    <div className="franchise__actions">
                        {
                            btnOneText ? (
                                <NavLink
                                    onClick={(e) => {
                                        const loginType = localStorage.getItem('loginType');
                                        const isVerified = Cookies.get('verified') === 'true';

                                        if (!token) {
                                            // Prevent navigation and show login prompt
                                            e.preventDefault();
                                            toast.error('You should log in first!');
                                            setTimeout(() => {
                                                navigate('/login');
                                                scrollToTop();
                                            }, 1000);
                                        } else if (loginType === 'user' && !isVerified) {
                                            // Prevent navigation and show verification prompt
                                            e.preventDefault();
                                            toast.error('You need to verify your account first!');
                                            setTimeout(() => {
                                                navigate('/user-verification');
                                                scrollToTop();
                                            }, 1000);
                                        } else {
                                            // Proceed with the default navigation
                                            scrollToTop();
                                        }
                                    }}
                                    to={btnOnelink}
                                    className='nav-link'
                                >
                                    <button>
                                        {btnOneText}
                                    </button>
                                </NavLink>
                            ) : (
                                ''
                            )
                        }
                        {
                            btnTwoText ?
                                <button>
                                    {btnTwoText}
                                </button>
                                :
                                ''
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
