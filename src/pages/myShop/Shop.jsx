import React from 'react';
import './shop.css';
import ShopProducts from '../../components/shopProductsSec/ShopProducts';

export default function Shop({token,fetchCartItems,wishlistItems}) {

  return (
    <>
      <ShopProducts fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} />
    </>
  );
};
