import React, { useEffect, useState } from 'react';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import './showOneProductInfoInDash.css';
import MyLoader from '../myLoaderSec/MyLoader';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import UnAuthSec from '../unAuthSection/UnAuthSec';

export default function ShowOneProductInfoInDash(
    { token, show_slug }) {
    const [loading, setLoading] = useState(true);
    const { itemId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [newData, setNewdata] = useState([]);
    const fetchProductInfo = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${show_slug}/${itemId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchProductInfo();
    }, [loginType, token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler showOneProductInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={`${newData?.title_en} main Details`} />
                                        <div className="content__card__list">
                                            <div className="row">
                                                <div className="col-12 showOneProductDash__item mb-5">
                                                    <h5>
                                                        {newData?.title_en} media
                                                    </h5>
                                                    <div className="showProdImagesInDash__handler">
                                                        {newData?.media ?
                                                            newData?.media?.map((el) => {
                                                                return (
                                                                    <div key={el?.id}>
                                                                        <div className="prod__image__item">
                                                                            <img src={el?.image} alt={`prod-img-${itemId}`} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            <div key={newData.id}>
                                                                <div className="prod__image__item">
                                                                    <img src={newData?.image} alt={`prod-img-${itemId}`} />
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-12 showOneProductDash__item mb-5">
                                                    <h5>
                                                        {newData?.title_en} Description
                                                    </h5>
                                                    <p>
                                                        {newData?.description_en}
                                                    </p>
                                                </div>
                                                <div className="col-12 showOneProductDash__item mb-5">
                                                    <h5>
                                                        {newData?.title_en} Code
                                                    </h5>
                                                    <p>
                                                        {newData?.code}
                                                    </p>
                                                </div>
                                                {
                                                    newData?.unit_of_measure &&
                                                    <div className="col-12 showOneProductDash__item mb-5">
                                                        <h5>
                                                            {newData?.title_en} unit of measure
                                                        </h5>
                                                        <p>
                                                            {newData?.unit_of_measure}
                                                        </p>
                                                    </div>
                                                }
                                                {
                                                    newData?.catalogTypes &&
                                                    <div className="col-12 showOneProductDash__item mb-5">
                                                        <h5>
                                                            {newData?.title_en} types
                                                        </h5>
                                                        {
                                                            newData?.catalogTypes?.map((type) => (
                                                                <p className='mb-2'>
                                                                    <i className="bi bi-check2-circle"></i>
                                                                    {type?.type}
                                                                </p>
                                                            ))
                                                        }
                                                    </div>
                                                }
                                                {
                                                    newData?.price &&
                                                    <div className="col-12 showOneProductDash__item mb-5">
                                                        <h5 >
                                                            {newData?.title_en} Price Information
                                                        </h5>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <h6>
                                                                    price
                                                                </h6>
                                                                <p>
                                                                    {newData?.price} {newData?.currency}
                                                                </p>
                                                            </div>
                                                            {
                                                                newData?.tax &&
                                                                <div className="col-6">
                                                                    <h6>
                                                                        tax (x%)
                                                                    </h6>
                                                                    <p>
                                                                        {newData?.tax}%
                                                                    </p>
                                                                </div>
                                                            }
                                                            {
                                                                newData?.price_after_tax &&
                                                                <div className="col-6 mt-4">
                                                                    <h6>
                                                                        price after tax
                                                                    </h6>
                                                                    <p>
                                                                        {newData?.price_after_tax} {newData?.currency}
                                                                    </p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                }

                                                <div className="col-12 showOneProductDash__item mb-5">
                                                    <h5>
                                                        {newData?.title_en} Category
                                                    </h5>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <h6>
                                                                Category
                                                            </h6>
                                                            <p>
                                                                {newData?.category}
                                                            </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <h6>
                                                                Sub-Category
                                                            </h6>
                                                            <p>
                                                                {newData?.subCategory}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    newData?.productAttribute &&
                                                    <div className="col-12 showOneProductDash__item mb-5">
                                                        <h5>
                                                            {newData?.title} Attributes
                                                        </h5>
                                                        <div className="row">
                                                            {
                                                                newData?.productAttributeValues?.map((att) => {
                                                                    return (
                                                                        <div key={att?.id} className="col-lg-6">
                                                                            <p>
                                                                                value: <span>{att?.value}</span>
                                                                            </p>
                                                                            <p>
                                                                                stock: <span>{att?.stock}</span>
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                }


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
