import React, { useEffect, useState } from 'react'

import ProductCard from '../productCardSec/ProductCard'
import HeaderSec from '../myHeaderSec/HeaderSec'
import { baseURL } from '../../functions/baseUrl'
import axios from 'axios'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop'
export default function ReadyToByProductsHome({ secMAinTitle,token,fetchCartItems,wishlistItems}) {
    const [newData, setNewdata] = useState([])
    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${baseURL}/user/products?t=${new Date().getTime()}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.products?.products);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        };
    };
    useEffect(() => {
        fetchAllProducts();
    }, []);

    return (
        <div className='readyToBuySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center mb-4">
                    <HeaderSec title={secMAinTitle}
                    />
                </div>
                <div className="readyToBuy__products">
                    <div className="row">
                        {
                            (newData?.length > 3 ? newData.slice(0, 3) : newData)?.map((el, index) => {
                                return (
                                    <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                                        <ProductCard
                                            fetchCartItems={fetchCartItems} wishlistItems={wishlistItems}
                                            discountPrice={el?.discountPrice}
                                            productCurrancy={el?.currency_symbol}
                                            token={token}
                                            getCurrentProducts={fetchAllProducts} product={el}
                                            itemType={'product'}  prodSlug={el?.slug} 
                                            productImage={el.productImages[0]?.image} productName={el.title} productPrice={el.price} productRate={el.rate} productRateNum={el.rateCount} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="showAllBtn d-flex justify-content-end align-items-center">
                        <NavLink className={'nav-link'} to={'/shop'}
                        onClick={() => {
                            scrollToTop();
                        }}
                        >
                            All Products
                            <i className="bi bi-arrow-bar-right"></i>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}
