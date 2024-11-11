import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';

export default function DestinationForm({ distinationData, setDistinationData, countries, isOneClickQuotation }) {
    const [currentCities, setCurrentCities] = useState([]);
    const [defaultCityValue, setdefaultCityValue] = useState('');
    const [currentAreas, setCurrentAreas] = useState([]);
    const [defaultAreaValue, setdefaultAreaValue] = useState('');

    const handleChangeInput = (e) => {
        setDistinationData({ ...distinationData, [e.target.name]: e.target.value })
        if (e.target.name === 'country_id') {
            setCurrentCities([]);
            const chosenCountry = countries?.find(el => +el?.id === +e.target?.value);
            if (chosenCountry) {
                setdefaultCityValue('');
                setdefaultAreaValue('');
                setDistinationData({ ...distinationData, 'country_id': e.target.value, 'city_id': '', 'area_id': '' });
                const toastId = toast.loading('Loading Cities , Please Wait !');
                const citiesInsideCurrentCountry = async () => {
                    const response = await axios.get(`${baseURL}/countries/${chosenCountry?.code}?t=${new Date().getTime()}`);
                    setCurrentCities(response?.data?.data?.cities);
                };
                citiesInsideCurrentCountry();
                if (currentCities) {
                    toast.success('Cities Loaded Successfully.', {
                        id: toastId,
                        duration: 2000
                    });
                } else {
                    toast.error('Please Choose Your Country Again!', {
                        id: toastId,
                        duration: 2000
                    });
                };
            };
        } if (e.target.name === 'city_id') {
            setdefaultCityValue(e.target.value);
            const currentCity = currentCities?.find(city => +city?.cityId === +e.target.value);
            if (currentCity) {
                setCurrentAreas(currentCity?.areas);
                setdefaultAreaValue('');
            };
        } else if (e.target.name === 'area_id') {
            setdefaultAreaValue(e.target.value);
        };
    };

    const handleChangeInputOneClickQuotation = (e) => {
        setDistinationData({ ...distinationData, [e.target.name]: e.target.value })
        if (e.target.name === 'destination_country_id') {
            setCurrentCities([]);
            const chosenCountry = countries?.find(el => +el?.id === +e.target?.value);
            if (chosenCountry) {
                setdefaultCityValue('');
                setdefaultAreaValue('');
                setDistinationData({ ...distinationData, 'destination_country_id': e.target.value, 'destination_city_id': '', 'destination_area_id': '' });
                const toastId = toast.loading('Loading Cities , Please Wait !');
                const citiesInsideCurrentCountry = async () => {
                    const response = await axios.get(`${baseURL}/countries/${chosenCountry?.code}?t=${new Date().getTime()}`);
                    setCurrentCities(response?.data?.data?.cities);
                };
                citiesInsideCurrentCountry();
                if (currentCities) {
                    toast.success('Cities Loaded Successfully.', {
                        id: toastId,
                        duration: 2000
                    });
                } else {
                    toast.error('Please Choose Your Country Again!', {
                        id: toastId,
                        duration: 2000
                    });
                };
            };
        } if (e.target.name === 'destination_city_id') {
            setdefaultCityValue(e.target.value);
            const currentCity = currentCities?.find(city => +city?.cityId === +e.target.value);
            if (currentCity) {
                setCurrentAreas(currentCity?.areas);
                setdefaultAreaValue('');
            };
        } else if (e.target.name === 'destination_area_id') {
            setdefaultAreaValue(e.target.value);
        };
    };

    return (
        <div className="destinationQuote__handler">
            <h3>
                Destination
            </h3>
            <form className="destinationQuote__form row">
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationCountry" className='position-relative'>
                            Country
                            <i title='choose country that you located for order' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </label>
                        <select
                            defaultValue={''}
                            className='form-select w-100'
                            id="distinationCountry"
                            name={isOneClickQuotation ? 'destination_country_id' : 'country_id'}
                            onChange={isOneClickQuotation ? handleChangeInputOneClickQuotation : handleChangeInput}
                        >
                            <option value='' disabled>Choose your country</option>
                            {
                                isOneClickQuotation ?
                                    countries?.map(country => (
                                        <option key={country?.id} value={country?.id}>{country?.name}</option>
                                    ))
                                    :
                                    countries?.map(country => (
                                        <option key={country?.id} value={country?.id}>{country?.name}</option>
                                    ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationCity" className='position-relative'>
                            City
                            <i title='choose city that you located for order' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </label>
                        <select
                            className='form-select w-100'
                            name={isOneClickQuotation ? 'destination_city_id' : 'city_id'}
                            id="distinationCity"
                            value={defaultCityValue}
                            onChange={isOneClickQuotation ? handleChangeInputOneClickQuotation : handleChangeInput}
                        >
                            <option value={''} disabled>Choose your city</option>
                            {
                                currentCities?.map(city => (
                                    <option key={city?.cityId} value={city?.cityId}>{city?.cityName}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4">
                    <div className="singleQuoteInput">
                        <label
                            htmlFor='distinationArea'
                            className='position-relative'
                        >
                            Area
                            <i title='choose area that you located for order' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </label>
                        <select
                            className='form-select w-100'
                            name={isOneClickQuotation ? 'destination_area_id' : 'area_id'}
                            id="distinationArea"
                            value={defaultAreaValue}
                            onChange={isOneClickQuotation ? handleChangeInputOneClickQuotation : handleChangeInput}
                        >
                            <option value={''} disabled>Choose your area</option>
                            {
                                currentAreas?.map(area => (
                                    <option value={area?.areaId} key={area?.areaId}>{area?.areaName}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="singleQuote__searchInput">
                        <h3 className='fs-4 position-relative'>
                            PO Box
                            <i title='add PO Box' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </h3>
                        <input name='po_box' className='form-control w-100' type="text" placeholder='Search here' value={distinationData?.po_box} onChange={handleChangeInput} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="singleQuote__searchInput">
                        <h3 className='fs-4 position-relative'>
                            Postal Code
                            <i title='add  Postal Code' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </h3>
                        <input name='postal_code' className='form-control w-100' type="text" placeholder='Search here' value={distinationData?.postal_code} onChange={handleChangeInput} />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="singleQuoteInput">
                        <label htmlFor="distinationAddress" className='position-relative'>
                            Address
                            <i title='write exact address that you located for order' className="bi bi-info-circle ms-2 cursorPointer " style={{fontSize:'16px',position:"absolute", top: '2px'}}></i>
                        </label>
                        <textarea
                            className="form-control"
                            id="distinationAddress"
                            rows="3"
                            name={'address'}
                            onChange={isOneClickQuotation ? handleChangeInputOneClickQuotation : handleChangeInput}
                            placeholder='Enter the address'
                        ></textarea>
                    </div>
                </div>
            </form>
        </div>
    )
}
