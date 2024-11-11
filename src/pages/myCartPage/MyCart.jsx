import React, { useEffect, useState } from 'react'
import './myCart.css'
import axios from 'axios'
import { scrollToTop } from '../../functions/scrollToTop'
import toast from 'react-hot-toast'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import { baseURL } from '../../functions/baseUrl'
import { NavLink, useNavigate } from 'react-router-dom';

export default function MyCart({ token , fetchCartItems }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [cartData, setCartData] = useState([]);
    const [toggleState, setToggleState] = useState({});
    const navigate = useNavigate();

    const fetchAllCartItems = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/my-cart?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartData(response?.data?.data?.cart);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
        };
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const response = await axios.post(`${baseURL}/${loginType}/remove-from-cart`,
                { cart_item_id: String(cartItemId) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                scrollToTop()
                toast.success(response?.data?.message || 'product item deleted successfully!');
                fetchCartItems();
            } else {
                toast.error('Failed to delete product item');
            }

            fetchAllCartItems();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting product item!');
        }
    };

    const toggleCompanyProducts = (companyId) => {
        setToggleState((prevState) => ({
            ...prevState,
            [companyId]: !prevState[companyId]
        }));
    };

    useEffect(() => {
        fetchAllCartItems();
    }, [loginType, token]);

    const cartItemsData = cartData?.cart_items;

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handleDecreaseOrIncrease = async (id, type, quantity, stock) => {
        if (+quantity === 1 && type === 'decrease') {
            toast.error("Quantity Can't be less than 1!");
        } else if (+quantity === +stock) {
            toast.error(`Invalid Quantity , Max Quantity is ${stock}`);
        } else {
            await axios.post(`${baseURL}/${loginType}/control-cart-quantity?t=${new Date().getTime()}`,
                {
                    cart_item_id: `${id}`,
                    quantity_type: `${type}`,
                }
                , {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    setCartData(response?.data?.data?.cart);
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.error?.quantity[0] || error?.response?.data?.message || 'Error!'}`, {
                        duration: 1000
                    });
                });
        };
    };

    const handleNavigateToCompanyCheckOut = (id) => {
        navigate(`/check-out/${id}`)
    };
console.log(cartData);

    return (
        <>
            {loading ?
                <MyLoader />
                :
                <div className='myCart__handler'>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="row my-5 ">
                                    {
                                        cartItemsData ?
                                            <div className="col-lg-8">
                                                {
                                                    Object.entries(cartItemsData)?.map(([companyName, companyDetails], idx) => (
                                                        <div key={idx} className="cartItems__content mb-5">
                                                            <h2
                                                                onClick={() => toggleCompanyProducts(companyDetails?.company_id)}
                                                                style={{ cursor: 'pointer' }}>
                                                                {companyName} products
                                                                <i className={`bi ${toggleState[companyDetails?.company_id] ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                                                                    style={{ marginLeft: '10px' }}></i>
                                                            </h2>
                                                            {
                                                                toggleState[companyDetails?.company_id] && companyDetails?.items?.map(item => (
                                                                    <div className="productCartItem__card mb-3">
                                                                        <div className="cartItem__img">
                                                                            <img src={item?.media[0]?.media} alt="item-img" />
                                                                        </div>
                                                                        <div className="cartItem__info">
                                                                            <div className="cartItem__info__left">
                                                                                <h5>
                                                                                    {item?.item_name}
                                                                                </h5>
                                                                                {
                                                                                    item?.item_attribute !== 'N/A' ?
                                                                                        <div className="item__attributes">
                                                                                            <div className="attribute__tit">
                                                                                                {item?.item_attribute_name}
                                                                                            </div>
                                                                                            <span>
                                                                                                {item?.item_attribute}
                                                                                            </span>
                                                                                        </div>
                                                                                        :
                                                                                        ''
                                                                                }

                                                                                <div className="item__qty">
                                                                                    <div className="selected__product__action">
                                                                                        <div className="quantity__btns">
                                                                                            <p className='decreaseBtn' onClick={() => handleDecreaseOrIncrease(item?.id, 'decrease', item?.quantity, item?.item_total_stock)}>-</p>
                                                                                            <span>{item?.quantity}</span>
                                                                                            <p className='increaseBtn' onClick={() => handleDecreaseOrIncrease(item?.id, 'increase', item?.quantity, item?.item_total_stock)}>+</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="remove__btn displayNoneOnSm"
                                                                                    onClick={() => removeFromCart(item?.id)}>
                                                                                    <i className="bi bi-trash3"></i>
                                                                                    <span>Remove</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="cartItem__info__right">
                                                                                <div className="cartItem__price">
                                                                                    <h3>
                                                                                        {cartData?.currency_symbol}{item?.total_price}
                                                                                    </h3>
                                                                                </div>
                                                                                <div className="remove__btn dislayNoneOnLg">
                                                                                    <i className="bi bi-trash3"></i>
                                                                                    <span>Remove</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                ))
                                                            }

                                                        </div>
                                                    )
                                                    )
                                                }
                                            </div>
                                            :
                                            <div className="emptyState">No Products In Cart Yet ,<NavLink to='/shop' className={'fw-medium ps-3 text-decoration-underline text-primary'}>open Shop.</NavLink></div>
                                    }
                                    <div className="col-lg-4">
                                        {
                                            cartItemsData &&
                                            Object.entries(cartItemsData)?.map(([companyName, companyDetails], idx) => (
                                                <div className="orderSummary__content mb-5">
                                                    <h5>
                                                        order summary <span className="optional">
                                                            ({companyName})
                                                        </span>
                                                    </h5>
                                                    <div className="couponCodeInput">
                                                        <input type="text" className="form-control" placeholder='Coupon Code' />
                                                        <button>
                                                            apply
                                                        </button>
                                                    </div>
                                                    <div className="orderSummary__info">
                                                        <div className="summaryInfo__item">
                                                            <span>
                                                                Subtotal ({companyDetails?.total_quantity} items)
                                                            </span>
                                                            <h5>
                                                                {companyDetails?.currency_symbol}{companyDetails.total_price.toFixed(2)}
                                                            </h5>
                                                        </div>

                                                    </div>
                                                    <div className="orderTotalPrice">
                                                        <div className="summaryInfo__item">
                                                            <div className='totPrice'>
                                                                Total <span>( inclusive of VAT )</span>
                                                            </div>
                                                            <h5>
                                                                {cartData?.currency_symbol}{(companyDetails.total_price.toFixed(2))}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="orderCheckout__btn">
                                                        <button onClick={() => handleNavigateToCompanyCheckOut(companyDetails?.company_id)}>
                                                            Checkout
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
