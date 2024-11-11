import React, { useEffect, useState } from 'react'
import './myCheckout.css'
import testImg from '../../assets/productImages/S0-unsplash-1_650d426ce6d6f.jpg'
import Cookies from 'js-cookie'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
export default function MyCheckout({ token }) {
    const { companyId } = useParams();

    const loginType = localStorage.getItem('loginType');
    const [checkoutData, setCheckoutData] = useState([]);
    const [allowedCities, setAllowedCities] =useState([])
    const [allowedAreas, setAllowedAreas] =useState([])
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedCityCost, setSelectedCityCost] = useState(0);
    const [currencyCode, setCurrencyCode] = useState('');
    const [countryId, setCountryId] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company_id: companyId,
        country_id: '',
        city_id: '',
        area_id: '',
        address: '',
        order_notes: '',
        name: '',
        phone: ''
    });

    const fetchCheckoutData = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/get-checkout/${companyId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCheckoutData(response?.data?.data);
            setAllowedCities(response?.data?.data?.shipping_cost_cities);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Faild To get Cart Products!');
        };
    };

    const fetchAllowedAreas = async (cityId) => {
        try {
            const response = await axios.get(`${baseURL}/cities/${cityId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllowedAreas(response?.data?.data?.areas || []);
            const fetchedCountryId = response?.data?.data?.countryId.toString(); 
            setFormData((prevData) => ({
                ...prevData,
                country_id: fetchedCountryId
            }));
            setCountryId(fetchedCountryId);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Failed to get Areas!');
        }
    };

    useEffect(() => {
        fetchCheckoutData();
    }, [loginType, token]);

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        const selectedCityData = allowedCities?.find(city => +city?.city_id === +cityId);
        setSelectedCityCost(parseFloat(+selectedCityData?.cost || 0));
        setCurrencyCode(selectedCityData?.currency_code);
        setFormData((prevData) => ({
            ...prevData,
            city_id: cityId,
            country_id: '' 
        }));
        fetchAllowedAreas(cityId);
    };

    const handleAreaChange = (e) => {
        const areaId = e.target.value;
        setSelectedArea(areaId);
        setFormData((prevData) => ({
            ...prevData,
            area_id: areaId
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        try {
            const response = await axios.post(`${baseURL}/${loginType}/checkout`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });
            toast.success(response?.data?.message || 'Order placed successfully!');
            navigate('/my-cart');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to place order!');
        };
    };

    const checkoutItemsData = checkoutData?.cart_items;


    return (
        <div className='myCheckout__handler'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row my-3">
                            <div className="col-lg-8 col-md-8">
                                <div className="checkout__mainContent">
                                    <h2>
                                        Your Shipping Information
                                    </h2>
                                    <div className="checkoutForm_info checkout_card">
                                        <h5 className='checkout_subTit'>
                                            Checkout Destination
                                        </h5>
                                        <div className="checkoutForm_items">
                                            <div className="singleQuoteInput">
                                                <label htmlFor="citySelect">
                                                    select city
                                                </label>
                                                <select
                                                    className='form-select'
                                                    id="citySelect"
                                                    value={selectedCity}
                                                    onChange={handleCityChange}
                                                >
                                                    <option value={''} disabled>Select city</option>
                                                    {
                                                        allowedCities?.map((city)=>(
                                                            <option key={city?.city_id} value={city?.city_id}>
                                                                {city?.city}
                                                            </option>
                                                        ))
                                                    }

                                                </select>
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="areaSelect">Select Area</label>
                                                <select
                                                    className='form-select'
                                                    id="areaSelect"
                                                    value={selectedArea}
                                                    onChange={handleAreaChange}
                                                >
                                                    <option value="" disabled>Select Area</option>
                                                    {allowedAreas?.map((area) => (
                                                        <option key={area?.areaId} value={area?.areaId}>
                                                            {area?.areaName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Address
                                                </label>
                                                <input
                                                    id=""
                                                    name="address"
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter Your Address'
                                                    value={formData?.address}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Name
                                                </label>
                                                <input
                                                    id=""
                                                    name="name"
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter Your Name'
                                                    value={formData?.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    phone
                                                </label>
                                                <input
                                                    id=""
                                                    name="phone"
                                                    className='form-control'
                                                    type="text"
                                                    placeholder='Enter your Phone'
                                                    value={formData?.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="singleQuoteInput">
                                                <label htmlFor="">
                                                    Order Notes
                                                </label>
                                                <textarea
                                                    id=""
                                                    name="order_notes"
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder='Enter Your Notes'
                                                    value={formData.order_notes}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h2>
                                        Your Order
                                    </h2>
                                    {
                                        checkoutItemsData &&
                                        Object.entries(checkoutItemsData)?.map(([companyName, companyDetails], idx) => (
                <div className="checkout_items checkout_card">
                    <h5 className='checkout_subTit'>
                        Shipment <span>({checkoutData?.total_quantity} items)</span>
                    </h5>
                    <div className="checkout_products">
                        {
                            companyDetails?.items?.map((item, index) => (
                                <div key={index} className="checkout_product_item mb-5">
                                    <div className="product_item_img">
                                        <img src={item?.media[0]?.media} alt='checkout-img' />
                                    </div>
                                    <div className="product_item_info">
                                        <h5>
                                            {item?.item_name}
                                        </h5>
                                        {
                                            item?.item_attribute_name !== 'N/A' && 
                                            <div className="item__attributes">
                                                <div className="attribute__tit">
                                                {item?.item_attribute_name}:
                                                </div>
                                                <span>
                                                    {item?.item_attribute}
                                                </span>
                                            </div>
                                        }
                                        <p>
                                            Qty: <span>{item?.quantity}</span>
                                        </p>
                                        <h5 className='item_price'>
                                                Total Price: {item?.currency_symbol} {item?.total_price}
                                            </h5>
                                        
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                                        ))
                                    }

                                    <h2>
                                        payment
                                    </h2>
                                    <div className="checkout_paymentMethod checkout_card">
                                        <h5 className='checkout_subTit'>
                                            <p className='paymentHint'>cash</p>
                                            Cash on delivery
                                            <p className='paymentNote'>Extra Charges may be applied</p>
                                        </h5>
                                        <div className="checkout_payment_details">
                                            <div className="payment_mainDetails">
                                                <h5>
                                                    Cash On Delivery
                                                </h5>
                                                <p>
                                                    Extra Charge: EGP 9.00
                                                </p>
                                            </div>
                                            <div className="paymentHint">
                                                Cash
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4">
                                <h2>
                                    Order summary
                                </h2>
                                <div className="orderSummary__content">
                                    <h5>
                                        order details
                                    </h5>

                                    <div className="orderSummary__info">
                                        <div className="summaryInfo__item">
                                            <span>
                                                Subtotal ({checkoutData?.total_quantity} items)
                                            </span>
                                            <h5>
                                                {checkoutData?.currency_symbol} {checkoutData?.total_price?.toFixed(2)}
                                            </h5>
                                        </div>
                                        <div className="summaryInfo__item">
                                            <span>
                                                Shipping Fee
                                            </span>
                                            <h5>
                                            {currencyCode} {selectedCityCost.toFixed(2)}
                                            </h5>
                                        </div>

                                    </div>
                                    <div className="orderTotalPrice">
                                        <div className="summaryInfo__item">
                                            <div className='totPrice'>
                                                Total <span>( inclusive of VAT )</span>
                                            </div>
                                            <h5>
                                            {checkoutData?.currency_symbol} {(parseFloat(checkoutData?.total_price) + parseFloat(selectedCityCost)).toFixed(2)}
                                            </h5>
                                        </div>
                                    </div>

                                </div>
                                
                                    <button className='orderCheckout__btn mt-4' onClick={handlePlaceOrder}>
                                        place order
                                    </button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
