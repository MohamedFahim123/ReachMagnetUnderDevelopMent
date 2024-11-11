import React, { useEffect, useState } from 'react';
import './productDetails.css';
import ProductDetailsDescriptionContent from '../../components/productDetailsDescriptionContentSec/ProductDetailsDescriptionContent';
import ProductDetailsOwnerOfCurrProduct from '../../components/productDetailsOwnerOfCurrProductSec/ProductDetailsOwnerOfCurrProduct';
import ProductDetailsSec from '../../components/productDetailsSecc/ProductDetailsSec';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import ProductCard from '../../components/productCardSec/ProductCard';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function ProductDetails({token,fetchCartItems,wishlistItems}) {
  const { singleProduct } = useParams();
  const loginType = localStorage.getItem('loginType');
  const [allProducts,setAllProducts] = useState([]);
  const [relatedProducts,setRelatedProducts] = useState([]);
  const [currentProduct,setCurrentProduct] = useState({});
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },500);
  },[loading]);

  const getCurrentProducts = async () => {
    await axios.get(`${baseURL}/user/products?t=${new Date().getTime()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setAllProducts(response?.data?.data?.products?.products);
    })
    .catch(error=>{
      toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
        duration: 1000
      });
    });
  };

  const getCurrentProduct = async (id) => {
    setLoading(true);
    await axios.get(`${baseURL}/user/show-product/${id}?t=${new Date().getTime()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setCurrentProduct(response?.data?.data?.product);
    })
    .catch(error=>{
      toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
        duration: 1000
      });
    });
    setLoading(false);
  };

  useEffect(()=>{
    if(singleProduct){
      getCurrentProducts();
    };
  },[token,loginType,singleProduct]);

  useEffect(() => {
    const findedProd = allProducts?.find(prod=> prod.slug === singleProduct);
    if(findedProd){
      const allCompanyProducts = allProducts?.filter(prod => prod?.company_name === findedProd?.company_name);
      setRelatedProducts(allCompanyProducts?.filter(prod => prod?.slug !== findedProd?.slug).slice(0, 12));
      getCurrentProduct(findedProd?.id);
    };
  },[singleProduct,allProducts]);

  return (
    <>
    {
      loading ? 
      <MyLoader />
      :
      <div className='productDetailsPage'>
      <ProductDetailsSec fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} getCurrentProduct={getCurrentProduct} itemType={'product'} product={currentProduct} token={token} />
      <ProductDetailsDescriptionContent product={currentProduct} /> 
      {
        relatedProducts.length > 0 &&
        <ProductDetailsOwnerOfCurrProduct companyName={currentProduct?.company_name} />
      }
      <div className="container">
            <div className="row">
              {
                relatedProducts?.map((el) => {
                  return (
                    <div key={el?.id} className="col-lg-3 col-md-4 col-sm-12 my-2 d-flex justify-content-center px-4 mb-5">
                      <ProductCard fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} discountPrice={el?.discountPrice} token={token} getCurrentProducts={getCurrentProducts} product={el} itemType={'product'} prodSlug={el?.slug} productCurrancy={el?.currency_symbol} productImage={el?.productImages[0]?.image} productName={el?.title} productPrice={el?.price} companyName={el?.company_name} />
                    </div>
                  )
                })
              }
            </div>
      </div>
    </div>
    }
    </>
  );
};
