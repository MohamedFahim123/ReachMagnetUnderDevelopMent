import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';

export default function NewShippingCostForm({ token, countries }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const { id } = useParams();
    const [currShippingCost,setCurrShippingCost] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        country_id: '',
        city_id: '',
        cost: '',
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/shipping-costs?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setCurrShippingCost(response?.data?.data?.shipping_costs?.find(el => +el?.id === +id));
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    const getCurrentCities = async (code)=>{
        await axios.get(`${baseURL}/countries/${code}?t=${new Date().getTime()}`)
            .then(response => {
                setCities(response?.data?.data?.cities);
                formData.city_id = response?.data?.data?.cities?.find(city => city?.cityName === currShippingCost?.city)?.cityId;
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Error fetching cities.');
            });
    };

    useEffect(()=>{
        if(+currShippingCost?.id === +id){
            formData.country_id = countries?.find(el => el?.name === currShippingCost?.country)?.id;
            const countryCode = countries?.find(el => el?.name === currShippingCost?.country)?.code;
            setSelectedCountry(countryCode);
            getCurrentCities(countryCode);
            formData.cost = currShippingCost?.cost;
        };
    },[currShippingCost]);


    const handleCountryChange = (e) => {
        const selectedCountryId = e.target.value;
        const selectedCountry = countries.find(country => country.id === parseInt(selectedCountryId));
        setSelectedCountry(selectedCountry.code);
        setFormData({ ...formData, country_id: selectedCountryId, city_id: '' });
        axios.get(`${baseURL}/countries/${selectedCountry.code}?t=${new Date().getTime()}`)
            .then(response => {
                setCities(response.data.data.cities);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Error fetching cities.');
            });
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setFormData({ ...formData, city_id: cityId });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();

        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const slugCompletion = id ? `shipping-costs-update/${id}` : 'shipping-costs';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}?t=${new Date().getTime()}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/shipping-costs');
                scrollToTop();
                toast.success(response?.data?.message || (id ? 'Cost updated successfully' :'Cost added successfully'));
            } else {
                toast.error(id ? 'Failed to update Cost' :'Failed to add Cost');
            };
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        };
    };

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
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={id ? 'Update Shipping Cost' : 'Add Shipping Cost'} />
                                <form className="catalog__form__items"
                                    onSubmit={handleFormSubmit}

                                >
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="country">Country</label>
                                                <select
                                                    name="country"
                                                    className="form-control custom-select"
                                                    value={formData.country_id}
                                                    onChange={handleCountryChange}
                                                >
                                                    <option value="" disabled>Select Country</option>
                                                    {countries?.map((country) => (
                                                        <option key={country?.id} value={country?.id}>
                                                            {country?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="city">City</label>
                                                <select
                                                    name="city"
                                                    className="form-control custom-select"
                                                    defaultValue={formData.city_id}
                                                    onChange={handleCityChange}
                                                    disabled={!selectedCountry}
                                                >
                                                    <option value="" disabled>Select City</option>
                                                    {cities?.map((city) => (
                                                        <option key={city?.cityId} value={city?.cityId}>
                                                            {city?.cityName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="cost">Shipping Cost</label>
                                                <input
                                                    type="text"
                                                    name="cost"
                                                    className="form-control"
                                                    placeholder="Enter your text"
                                                    defaultValue={formData.cost}
                                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            { id ? 'Update Shipping Cost' : 'Add Shipping Cost'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
