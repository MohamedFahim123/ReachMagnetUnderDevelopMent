import React, { useEffect, useState } from 'react'
import './lastMinuteDeals.css'
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec'
import LastMinuteCard from '../lastMinuteCardSec/LastMinuteCard'
import lastMinuteLogo from '../../assets/logos/Group (2).png'
import { baseURL } from '../../functions/baseUrl'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop'
export default function LastMinuteDeals({token}) {
    const navigate = useNavigate();
    const [newData, setNewdata] = useState([]);
    const fetchLastMinuteDeals = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/last-minute-deals?t=${new Date().getTime()}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.last_minute_deals);
        } catch (error) {
            console.log(error);
        };
    };
    useEffect(() => {
        fetchLastMinuteDeals();
    }, []);

    return (
        <>
        {
            newData?.length !== 0 && 
            <div className='lastMinuteDeals__handler'>
            <div className="container">
                <HeaderOfSec secHead='Last Minute Deals'
                    secText='Secure limited-time deals on large lots or specific quantities before they are gone' />
                <div className="lastMinuteDeal__logo__img">
                    <img src={lastMinuteLogo} alt="lastMinute__logo" />
                </div>
                <div className="lastMinuteDeals__cards mb-4">
                    <div className="row">
                        {
                            newData?.map((el) => {
                                return (
                                    <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mb-4">
                                        <LastMinuteCard
                                            productImage={el?.medias[0].media}
                                            productName={el?.title}
                                            productLink={`/lastMinuteDeals/${el?.id}`}
                                            dealTimeDay={el?.limited_date}
                                            dealQuantity={`${el?.quantity} picees`}
                                            showCustomContent={false}
                                            buttonLabel="Know more"
                                            onKnowMoreClick={() => {
                                                scrollToTop();
                                                navigate(`/lastMinuteDeals/${el?.id}`);
                                            }}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            </div>
        }
        </>
        
    )
}
