import React, { useEffect, useState } from 'react';
import './myWishListSec.css';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductCard from '../../components/productCardSec/ProductCard';
import { NavLink } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function MyWishList({token , fetchCartItems , wishlistItems}) {
  const [loading,setLoading] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [wishListData, setWishListData] = useState([]);

  const fetchWishListItems = async () => {
    await axios.get(`${baseURL}/${loginType}/my-wishlist?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setWishListData(response?.data?.data?.wish_list);
    }).catch(error => {
      toast.error(error?.response?.data.message || 'Faild To get WishList Products!');
    });
  };

  useEffect(() => {
    fetchWishListItems();
  }, [loginType, token]);
  console.log(wishListData);
  

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },500);
  },[loading]);

  return (
    <>
      {
        loading ? 
        <MyLoader />
        :
        <div className='wishList__handler'>
        <div className="container">
          <div className="row">
            <div className="col-12 pb-5 wishList__head">
              <h1>
                <i className="bi bi-heart text-danger"></i> Wishlist
              </h1>
            </div>
            <div className="col-12 wishList__body">
              <div className="row">
                <div className="col-lg-3 pt-4 pb-5 wishList__body__leftContent">
                  <div className="wishList__body__leftCard">
                    <h3>
                      Default
                      <span className="defaultSpan">Default</span>
                    </h3>
                    <p>
                      {wishListData?.length > 0 ? `${wishListData?.length} Item${wishListData.length !== 1 ? 's' : ''}` : 'No Items Yet'}
                      <i className="bi bi-lock-fill"></i>
                    </p>
                  </div>
                </div>
                <div className="col-lg-9 pb-5 px-0 wishList__body__rightContent">
                  <div className="wishList__head py-4 px-3">
                    <h2>
                      Default <span className="defaultSpan">Default</span>
                    </h2>
                  </div>

                  <div className="wishList__body__rightBottomContent px-3 py-4 row">
                  {
                    wishListData?.length === 0 ? 
                    <div className="col-12">No Products Inside Your WishList <NavLink to='/shop' className={'text-decoration-underline'}>Open Shop</NavLink></div>
                    :
                    wishListData?.map((el) => {
                      return (
                        <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 my-2 d-flex justify-content-center">
                          <ProductCard fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} discountPrice={el?.product_discount_price} wishListPage={true} getCurrentProducts={fetchWishListItems} product={el} itemType={'product'} token={token} prodSlug={el?.product_slug} productCurrancy={el?.currency_symbol} productImage={el?.medias[0]?.media} productName={el?.product_title} productPrice={el?.product_price} companyName={el?.company_name} />
                        </div>
                      )
                    })
                  }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      }
    </>
  );
};