import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
export default function ShowOneECommProductInDash({token}) {
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
            const response = await axios.get(`${baseURL}/${loginType}/show-product/${itemId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.product);
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
    console.log(newData);

    return (
        <>
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
                {
                    newData?.images?.length !== 0 && (
                    <div className="col-12 showOneProductDash__item mb-5">
                    <h5>
                        {newData?.title_en} media
                    </h5>
                    <div className="showProdImagesInDash__handler">
                        { 
                            newData?.images?.map((el) => {
                                return (
                                    <div key={el?.id}>
                                        <div className="prod__image__item">
                                            <img src={el?.image} alt={`prod-img-${itemId}`} />
                                        </div>
                                    </div>
                                )
                            })
                           
                        }
                    </div>
                </div>
                    ) 
                }
                
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
                        {newData?.title_en} dangerouses
                    </h5>
                    {
                        newData?.dangerouses?.map((danger, idx)=>(
                            <p key={danger?.id} className='mb-2'>
                                {idx+1}- {danger?.name}
                            </p>
                        ))
                    }
                </div>
                <div className="col-12 showOneProductDash__item mb-5">
                    <h5>
                        {newData?.title_en} Brand
                    </h5>
                    <p>
                        {newData?.brand}
                    </p>
                </div>
                <div className="col-12 showOneProductDash__item mb-5">
                    <h5>
                        {newData?.title_en} Origin
                    </h5>
                    <p>
                        {newData?.origin}
                    </p>
                </div>
                <div className="col-12 showOneProductDash__item mb-5">
                    <h5>
                        {newData?.title_en} Total Stock
                    </h5>
                    <p>
                        {newData?.total_stock}
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
                    newData?.discount_amount && newData?.discount_type && newData?.tax &&
                    <div className="col-12 showOneProductDash__item mb-5">
                    <h5 >
                        {newData?.title_en} Price Information
                    </h5>
                    <div className="row">
                        {
                            newData?.discount_type &&
                            <div className="col-6">
                            <h6>
                                Discount Type
                            </h6>
                            <p>
                                {newData?.discount_type}
                            </p>
                        </div>
                        }
                        {
                            newData?.discount_amount &&
                            <div className="col-6 mb-3">
                            <h6>
                                Discount Amount
                            </h6>
                            <p>
                                {newData?.discount_type === "fixed" ? '$' : '%'}{newData?.discount_amount}
                            </p>
                        </div>
                        }
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
                    newData?.variation_name  !== 'N/A'  ?
                    <div className="col-12 showOneProductDash__item mb-5">
                        <h5>
                            {newData?.title} Variations
                        </h5>
                        <div className="row">
                            {
                                newData?.product_variations?.map((vari)=>(
                                    <>
                                    <div key={vari?.id} className="col-6">
                                        <h6 className='mb-3'>
                                           <strong className="me-1">{vari?.variation_key}:</strong> {vari?.variation_value}
                                        </h6>
                                        { 
                                            newData?.sub_variation_name === 'N/A' &&
                                            <div key={vari?.id} style={{borderRadius:'12px',display: 'flex', flexDirection:'column', gap:'12px'}} className='border p-3 mb-4'>
                                            
                                            <p>
                                                <strong className="me-2">dimensions with package:</strong>
                                                {
                                                    vari?.dimensions_with_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">dimensions without package:</strong>
                                                {
                                                    vari?.dimensions_without_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">price after tax and discount:</strong>
                                                ${
                                                    vari?.price_after_discount
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Stock:</strong>
                                                {
                                                    vari?.stock
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Sku:</strong>
                                                {
                                                    vari?.sku
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Weight:</strong>
                                                {
                                                    vari?.weight
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">images:</strong>
                                                {
                                                    vari?.images?.map((el)=>(
                                                        <img style={{width:'30px', height:'30px', borderRadius:'8px',
                                                        marginLeft:'8px'
                                                        }} src={el?.image} alt="" />
                                                    ))
                                                }
                                            </p>
                                            </div>
                                        }
                                        { 
                                        newData?.sub_variation_name !== 'N/A' &&
                                        vari?.sub_variations?.map((subVari)=>(
                                            <div key={subVari?.id} style={{borderRadius:'12px',display: 'flex', flexDirection:'column', gap:'12px'}} className='border p-3 mb-4'>
                                             <p>
                                               <strong className="me-2"> {subVari?.sub_variation_key}:</strong> {subVari?.sub_variation_value}
                                            </p>
                                            <p>
                                                <strong className="me-2">dimensions with package:</strong>
                                                {
                                                    subVari?.dimensions_with_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">dimensions without package:</strong>
                                                {
                                                    subVari?.dimensions_without_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">price after tax and discount:</strong>
                                                ${
                                                    subVari?.price_after_discount
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Stock:</strong>
                                                {
                                                    subVari?.stock
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Sku:</strong>
                                                {
                                                    subVari?.sku
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Weight:</strong>
                                                {
                                                    subVari?.weight
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">images:</strong>
                                                {
                                                    subVari?.images?.map((el)=>(
                                                        <img style={{width:'30px', height:'30px', borderRadius:'8px',
                                                        marginLeft:'8px'
                                                        }} src={el?.image} alt="" />
                                                    ))
                                                }
                                            </p>
                                            </div>
                                           
                                        ))
                                        }
                                    </div>
                                    
                                    
                                    </>
                                ))
                            }
                             
                        </div>

                    </div>
                    :
                    <div className="col-12 showOneProductDash__item mb-5">
                        <h5>
                            {newData?.title} Attributes
                        </h5>
                        <div className="row">
                            {
                                    <>
                                    <div className="col-6">
                                        { 
                                            
                                            <div style={{borderRadius:'12px',display: 'flex', flexDirection:'column', gap:'12px'}} className='border p-3 mb-4'>
                                            <p>
                                                <strong className="me-2">dimensions with package:</strong>
                                                {
                                                    newData?.dimensions_with_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">dimensions without package:</strong>
                                                {
                                                    newData?.dimensions_without_package
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">price after tax and discount:</strong>
                                                ${
                                                    newData?.price_after_discount
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Stock:</strong>
                                                {
                                                    newData?.total_stock
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Sku:</strong>
                                                {
                                                    newData?.sku
                                                }
                                            </p>
                                            <p>
                                                <strong className="me-2">Weight:</strong>
                                                {
                                                    newData?.weight
                                                }
                                            </p>
                                            
                                            </div>
                                        }
                                    </div>
                                    </>
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
        </>
    )
}
