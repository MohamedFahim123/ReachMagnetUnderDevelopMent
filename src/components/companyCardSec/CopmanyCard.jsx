import React from 'react'
import './companyCard.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function CopmanyCard({ token ,currentFollowedCompanies,setCurrentFollowedCompanies , coverImg, companyProfile, companyName, companyUser, productsCount, dealsCount, ownerCount, cardDesc, companyId }) {
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();

    const handleToggleFollowCompany = async (id) => {
        const currentCompanyWantedToFollow = {
            company_id: `${id}`
        };
        const toastId = toast.loading('loading...');
        const slug = loginType === 'user' ? 'user/control-follow-company' : 'employee/control-follow'
            await axios.post(`${baseURL}/${slug}?t=${new Date().getTime()}`, 
            currentCompanyWantedToFollow ,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${token}`
                },
            })
            .then(response => {
                Cookies.set('CurrentFollowedCompanies',JSON.stringify([...response?.data?.data?.followedCompanies]),{expires: 999999999999999999999999999999 * 99999999999999999999999999999999999 * 99999999999999999999999999999999});
                setCurrentFollowedCompanies([...response?.data?.data?.followedCompanies]);
                toast.success(`${response?.data?.message}`,{
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(() =>{
                toast.error(`Something Went Wrong Please try Again Later!`,{
                    id: toastId,
                    duration: 1000
                });
            });
    };

    return (
        <div className='companyCard__item'>
            <div className="card__cover">
                <img src={coverImg} alt="cover" />
            </div>
            <div className="card__content">
                <div className="card__info">
                    <div className="company__profile">
                        <img src={companyProfile} alt="profile" />
                    </div>
                    <div className="company__name">
                        <h2>
                            <NavLink
                                onClick={() => {
                                    scrollToTop();
                                }} to={`/show-company/${companyId}`} className={'nav-link'}>
                                {companyName}
                            </NavLink>
                        </h2>
                    </div>
                    <div className="company__user">
                        <h5>
                            {companyUser}
                        </h5>
                    </div>
                    <div className="company__data">
                        <div className="company__products compDataStyle">
                            <h3>
                                {productsCount}
                            </h3>
                            <p>
                                products
                            </p>
                        </div>
                        <div className="company__deals compDataStyle">
                            <h3>
                                {dealsCount}
                            </h3>
                            <p>
                                services
                            </p>
                        </div>
                        <div className="company__owner compDataStyle">
                            <h3>
                                {ownerCount}
                            </h3>
                            <p>
                                orders
                            </p>
                        </div>
                    </div>
                </div>
                {
                    
                    <div className="card__actions">
                    {
                        (token) ? 
                            (currentFollowedCompanies) ?
                            currentFollowedCompanies?.find(el => +el?.companyId === +companyId) ?
                                <button 
                                    className='pageMainBtnStyle unFollowCompanyBtn'
                                    onClick={()=> handleToggleFollowCompany(companyId)}
                                >
                                    unFollow
                                </button>
                                :
                                <button 
                                    className='pageMainBtnStyle followCompanyBtn'
                                    onClick={() => handleToggleFollowCompany(companyId)}
                                >
                                    + follow
                                </button>
                            : ''
                        : 
                        <button 
                            className='pageMainBtnStyle followCompanyBtn'
                            onClick={()=> {
                                toast.error(`${loginType === 'user' ? 'You Should Login First!' : 'Only Users Can Follow Companies!'}`);
                                if(loginType === 'user'){
                                    setTimeout(()=>{
                                        navigate('/login');
                                        scrollToTop();
                                    },1000);
                                };
                            }}
                        >
                            + follow
                        </button>
                    }
                    </div>
                }
                
            </div>
            <div className="card__description">
                <p>
                    {cardDesc}
                </p>
            </div>
        </div>
    )
}
