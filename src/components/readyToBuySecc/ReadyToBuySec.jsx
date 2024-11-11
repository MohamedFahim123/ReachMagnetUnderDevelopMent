import React from 'react'
import './readyToBuySec.css'
import BorderedNavigationBar from '../borderedNavigationBarSec/BorderedNavigationBar'
import ProductCard from '../productCardSec/ProductCard'
import HeaderSec from '../myHeaderSec/HeaderSec'
export default function ReadyToBuySec({token,secMAinTitle, companies,showCompaniesQuery,fetchCartItems,wishlistItems}) {
    const listedNavigationItem = [
        {
            item: 'Featured Products',
            itemStyle: 'active'
        },
        {
            item: 'Most Selling'
        },
        {
            item: 'Recent Items'
        },
        {
            item: 'Trending Products'
        },
    ];

    return (
        <div className='readyToBuySec__handler'>
            <div className="container">
                <div className="allCategory__header text-center mb-4">
                    <HeaderSec title={secMAinTitle}
                    />
                </div>
                <div className="readyToBuy__navigationBar none__on__small__screen">
                    <ul className="listedNavigate">
                        {
                            listedNavigationItem.map((el, index) => {
                                return (
                                    <BorderedNavigationBar itemStyle={el.itemStyle} key={index} listTitle={el.item} />
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="readyToBuy__selectBar display__on__small__screen">
                    <>
                        <select name="" id="">
                            {
                                listedNavigationItem.map((el, index)=>{
                                    return(
                                        <option key={index}>{el.item}</option>
                                    )
                                })
                            }
                            
                        </select>
                    </>
                </div>
                <div className="readyToBuy__products">
                    <div className="row">
                        {
                            companies?.companyProducts?.map((el, index) => {
                                return (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                                        <ProductCard fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} discountPrice={el?.productDiscountPrice} getCurrentProducts={showCompaniesQuery?.refetch} token={token}  product={el} itemType={'product'} prodSlug={el?.productSlug} productCurrancy={el?.currency_symbol} productName={el?.productTitle} productPrice={el?.productPrice} companyName={el?.productCompanyName} 
                                        productImage={el.productMedias[0]?.image} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
