import React, { useCallback, useEffect, useState } from 'react'
import './oneClickQuotation.css'
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec'
import CartProduct from '../../components/cartProductSec/CartProduct'
import DestinationForm from '../../components/destinationFormSec/DestinationForm';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllRegionsStore } from '../../store/AllResions';
import { GetQutationsAllIndustriesStore } from '../../store/QutationsAllIndustries';
export default function OneClickQuotation({ token }) {
    const [loading, setLoading] = useState(true);
    const [requestIntries, setRequestIntries] = useState({
        industry_id: '',
        sub_industry_id: '',
        region_id: '',
        country_id: '',
        city_id: '',
    });
    const { industriesQ, getAllIndustriesQ } = GetQutationsAllIndustriesStore();
    const getAllIndustries = useCallback(() => {
        if (industriesQ?.length === 0) {
            getAllIndustriesQ();
        };
    }, [industriesQ.length, getAllIndustriesQ]);

    useEffect(() => {
        getAllIndustries();
    }, [getAllIndustries]);
    const [cart, setCart] = useState([]);
    const [cartCompanies, setCartCompanies] = useState(0);
    const [loadingCart, setloadingCart] = useState(true);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const [errorCart, setErrorCart] = useState(null);
    const [currentCountries, setCurrentCountries] = useState([]);
    const [currentCities, setCurrentCities] = useState([]);
    const [currentSubIndustries, setCurrentSubIndustries] = useState([]);
    const typesOfQuotations = [
        { id: 1, name: 'catalog' }, { id: 2, name: 'service' }
    ];
    const loginType = localStorage.getItem(`loginType`);
    const [customProduct, setCustomProduct] = useState({
        title: '',
        quantity: '',
        description: '',
        file: [],
    });
    const [distinationData, setDistinationData] = useState({
        include_shipping: false,
        include_insurance: false,
        destination_country_id: '',
        destination_city_id: '',
        destination_area_id: '',
        address: '',
        industry_id: requestIntries?.industry_id ? requestIntries?.industry_id : '',
        sub_industry_id: requestIntries?.sub_industry_id ? requestIntries?.sub_industry_id : '',
        longitude: '',
        latitude: '',
        po_box: '',
        currency: '',
        target_budget: '',
        target_delivery_time: "",
        preferred_delivery_terms: "",
    });
    const countries = GetAllCountriesStore((state) => state.countries);
    const regions = GetAllRegionsStore((state) => state.regions);

    useEffect(() => {
        if (token && (loginType === 'user')) {
            setloadingCart(true);
            (async () => {
                try {
                    const response = await fetch(`${baseURL}/user/prepare-one-click-quotation?t=${new Date().getTime()}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    };
                    const result = await response.json();
                    setCart(result?.data);
                } catch (err) {
                    setErrorCart(err.message);
                }
                setloadingCart(false);
            })();
        };
    }, [loginType, token]);

    const [currCurrencies, setCurrCurrencies] = useState([]);
    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        setDistinationData((prevData) => ({
            ...prevData,
            currency: selectedCurrency,
        }));
    };

    const handleResetCurrentQuotation = () => {
        (async () => {
            setloadingCart(true);
            setRequestIntries({
                industry_id: '',
                sub_industry_id: '',
                region_id: '',
                country_id: '',
                city_id: ''
            });
            setDistinationData({

                include_shipping: false,
                include_insurance: false,
                destination_country_id: '',
                destination_city_id: '',
                destination_area_id: '',
                address: '',
                industry_id: requestIntries?.industry_id ? requestIntries?.industry_id : '',
                sub_industry_id: requestIntries?.sub_industry_id ? requestIntries?.sub_industry_id : '',
                longitude: '',
                latitude: '',
                po_box: '',
                currency: '',
                target_budget: '',
                target_delivery_time: "",
                preferred_delivery_terms: "",
            })
            const toastId = toast.loading('Loading...');
            const res = await fetch(`${baseURL}/user/reset-one-click-quotation-cart`
                , {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
            const response = await res.json();
            if (response?.status === 200) {
                setCart(response?.data?.data);
                toast.success(`${response?.message || 'Receted Successfully!'}`, {
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(`${response?.message || 'Error!'}`, {
                    id: toastId,
                    duration: 1000
                });
            }
            setloadingCart(false);
        })();
    };

    const handleGettingCurrentSubIndustries = (event) => {
        const currentCategoryChosed = industriesQ?.find(cat => +cat?.id === +event?.target?.value);
        if (currentCategoryChosed) {
            setRequestIntries({ ...requestIntries, industry_id: event?.target?.value, sub_industry_id: '' });
            setCurrentSubIndustries([]);
            const toastId = toast.loading('Loading Sub-Industries');
            (async () => {
                await axios.get(`${baseURL}/show-industry-sub-industries/${currentCategoryChosed?.id}`, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then(response => {
                        setCurrentSubIndustries(response?.data?.data?.subIndustries);
                        toast.success(response?.data?.message || 'Sub-Industries Loaded Successfully!', {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Error!, please Try Again.', {
                            id: toastId,
                            duration: 1000
                        });
                    });
            })();
        };
    };

    const handleChangeRegion = (event) => {
        setRequestIntries({ ...requestIntries, region_id: event?.target?.value, country_id: '', city_id: '' });
        setCurrentCities([]);
        setCurrentCountries([]);
        const toastId = toast.loading('Loading Countries');
        (async () => {
            await axios.get(`${baseURL}/regions/${event?.target?.value}?t=${new Date().getTime()}`, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(response => {
                    setCurrentCountries(response?.data?.data?.country);
                    toast.success(response?.data?.message || 'Countries Loaded Successfully!', {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Error!, please Try Again.', {
                        id: toastId,
                        duration: 1000
                    });
                })
        })();
    };

    const handleChangeCountry = (event) => {
        setRequestIntries({ ...requestIntries, country_id: event?.target?.value, city_id: '' });
        const currentCountryChosen = currentCountries?.find(country => +country?.id === +event?.target?.value);
        if (currentCountryChosen) {
            const toastId = toast.loading('Loading Cities');
            (async () => {
                await axios.get(`${baseURL}/countries/${currentCountryChosen?.code}?t=${new Date().getTime()}`, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                    .then(response => {
                        setCurrentCities(response?.data?.data?.cities);
                        toast.success(response?.data?.message || 'Cities Loaded Successfully!', {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Error!, please Try Again.', {
                            id: toastId,
                            duration: 1000
                        });
                    })
            })();
        };
    };

    useEffect(() => {
        if (token && loginType && requestIntries?.industry_id && requestIntries?.sub_industry_id) {
            setloadingCart(true);
            (async () => {
                const toastId = toast.loading('Loading...');
                try {
                    const response = await fetch(`${baseURL}/user/filter-to-make-one-click-quotation?t=${new Date().getTime()}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify(requestIntries),
                        },
                    );
                    const result = await response.json();
                    if (result?.status === 200) {
                        setCartCompanies(result?.data?.company_count);
                        setCurrCurrencies(result?.data?.currencies);
                        setCart(result?.data?.cart);
                        toast.success(result?.message || 'Loaded Successfully', {
                            id: toastId,
                            duration: 1000,
                        });
                    } else {
                        throw new Error(result?.errors?.type || result?.message || 'Network response was not ok');
                    }
                } catch (err) {
                    toast.error(`${err}`, {
                        id: toastId,
                        duration: 1000,
                    });
                };
            })();
            setloadingCart(false);
        }
        setCustomProduct({
            ...customProduct,
            industry_id: requestIntries?.industry_id,
            sub_industry_id: requestIntries?.sub_industry_id
        });
        setDistinationData({ ...distinationData, industry_id: requestIntries?.industry_id, sub_industry_id: requestIntries?.sub_industry_id });
    }, [requestIntries]);

    const handleCheckboxChange = (e) => {
        setDistinationData({ ...distinationData, [e.target.name]: e.target.checked });
    };

    const handleCustomProductChange = (e) => {
        const { name, value } = e.target;
        setCustomProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCustomProductChangeImage = (e) => {
        const files = e.target.files;
        setCustomProduct((prevState) => ({
            ...prevState,
            file: [...files],
        }));
    };

    const handleAddCustomProduct = () => {
        const formData = new FormData();
        Object.keys(customProduct).forEach((key) => {
            if (key !== 'file') {
                formData.append(key, customProduct[key]);
            } else if (key === 'file' && !Array.isArray(customProduct[key])) {
                formData.append('file', customProduct.file[0]);
            } else if (Array.isArray(customProduct[key]) && key === 'file') {
                customProduct[key].forEach((file, index) => {
                    formData.append(`file[${index}]`, file);
                });
            }
        });
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/add-cutomized-item-for-one-click-quotation-cart?t=${new Date().getTime()}`,
                formData
                , {
                    headers: {
                        'Content-type': 'multipart/form-data',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    setCart(response?.data?.data);
                    setCustomProduct({
                        title: '',
                        quantity: '',
                        description: '',
                        file: '',
                        industry_id: requestIntries?.industry_id,
                        sub_industry_id: requestIntries?.sub_industry_id
                    });
                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(`${(error?.response?.data?.errors?.type && error?.response?.data?.errors?.type[0]) ||
                        (error?.response?.data?.errors?.industry_id && error?.response?.data?.errors?.industry_id[0]) ||
                        (error?.response?.data?.errors?.sub_industry_id && error?.response?.data?.errors?.sub_industry_id[0]) ||
                        error?.response?.data?.message ||
                        error?.message ||
                        'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                });
        })();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        (async () => {
            setloadingSubmit(true);
            const data = {
                ...distinationData
                , include_shipping: distinationData?.include_shipping ? 'yes' : 'no'
                , include_insurance: distinationData?.include_insurance ? 'yes' : 'no',
            };
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/make-one-click-quotation?t=${new Date().getTime()}`,
                data, {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    setRequestIntries({
                        industry_id: '',
                        sub_industry_id: '',
                        region_id: '',
                        country_id: '',
                        city_id: ''
                    });
                    setDistinationData({
                        include_shipping: false,
                        include_insurance: false,
                        destination_country_id: '',
                        destination_city_id: '',
                        destination_area_id: '',
                        address: '',
                        industry_id: requestIntries?.industry_id ? requestIntries?.industry_id : '',
                        sub_industry_id: requestIntries?.sub_industry_id ? requestIntries?.sub_industry_id : '',
                        longitude: '',
                        latitude: '',
                        po_box: '',
                        currency: '',
                        target_budget: '',
                        target_delivery_time: "",
                        preferred_delivery_terms: "",
                    });
                    setCart([]);
                    toast.success(`${response?.data?.message || 'Sent Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                })
                .catch(error => {
                    toast.error(`${error?.response?.data?.errors?.destination_country_id ||
                        error?.response?.data?.errors?.destination_city_id ||
                        error?.response?.data?.errors?.destination_area_id ||
                        error?.response?.data?.errors?.address ||
                        error?.response?.data?.errors?.longitude ||
                        error?.response?.data?.errors?.latitude ||
                        error?.response?.data?.errors?.po_box ||
                        error?.response?.data?.errors?.currency ||
                        error?.response?.data?.errors?.target_budget ||
                        error?.response?.data?.errors?.target_delivery_time ||
                        error?.response?.data?.errors?.preferred_delivery_terms ||
                        error?.reponse?.data?.message || 'Error!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                });
            setloadingSubmit(false);
        })();
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
console.log(distinationData);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='oneClickQuotation__handler'>
                        <MyMainHeroSec
                            heroSecContainerType='singleCompany__quote'
                            headText='Explore all options'
                            paraPartOne='Save  thousands to millions of bucks by using tool great skills, be a cool React Developer'
                        />
                        <>
                            <div className="singleCompanyQuote__contents">
                                <div className="container">
                                    <div className="singleCompanyQuote__headText">
                                        <h1>
                                            One-click quotation
                                        </h1>
                                        <p>
                                            Get an Instant Quote with One Click
                                        </p>
                                    </div>
                                    <div className="singleCompanyQuote__mainFrom">
                                        <form onSubmit={handleFormSubmit} className='row'>
                                            <div className="col-12 d-flex justify-content-end align-items-center mb-5">
                                                <span onClick={handleResetCurrentQuotation} className='deleteRuleBtn mt-3 me-5'>Reset Quote</span>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="singleQuoteInput">
                                                            <label htmlFor="oneclickquotationSelectMainIndustry">
                                                                Industry
                                                            </label>
                                                            <select
                                                                className='form-select'
                                                                id="oneclickquotationSelectMainIndustry"
                                                                value={requestIntries?.industry_id}
                                                                onChange={handleGettingCurrentSubIndustries}
                                                            >
                                                                <option value={''} disabled>Select Industry</option>
                                                                {industriesQ?.map(cat => (
                                                                    <option
                                                                        value={cat?.id}
                                                                        key={cat?.id}
                                                                    >{cat?.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="singleQuoteInput">
                                                            <label htmlFor="oneclickqouteSelectSubIndustry">
                                                                Sub-Industry
                                                            </label>
                                                            <select
                                                                value={requestIntries?.sub_industry_id}
                                                                className='form-select'
                                                                id="oneclickqouteSelectSubIndustry"
                                                                onChange={(event) => {
                                                                    setRequestIntries({ ...requestIntries, sub_industry_id: event?.target?.value })
                                                                }}
                                                            >
                                                                <option value="" disabled>Select Sub-Industry</option>
                                                                {
                                                                    currentSubIndustries?.map(subCat => (
                                                                        <option value={subCat?.id} key={subCat?.id}>{subCat?.name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="oneclickqouteSelectSubCategory">
                                                        Sub-category
                                                    </label>
                                                    <select
                                                        value={requestIntries?.sub_category_id}
                                                        className='form-select'
                                                        id="oneclickqouteSelectSubCategory"
                                                        onChange={(event) => {
                                                            setRequestIntries({ ...requestIntries, sub_category_id: event?.target?.value })
                                                        }}
                                                    >
                                                        <option value="" disabled>Select Sub-Category</option>
                                                        {
                                                            currentSubIndustries?.map(subCat => (
                                                                <option value={subCat?.subCategoryId} key={subCat?.subCategoryId}>{subCat?.subCategoryName}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div> */}
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="oneclickQuotationRegionSelect">
                                                        Choose your region
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        name="region_id"
                                                        id="oneclickQuotationRegionSelect"
                                                        value={requestIntries?.region_id}
                                                        onChange={handleChangeRegion}
                                                    >
                                                        <option value="" disabled>Choose Your Region</option>
                                                        {regions?.map((reg) => (
                                                            <option key={reg?.id} value={reg?.id}>{reg?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="oneclickQuotationCountriesnSelect">
                                                        Choose your Country
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        name="country_id"
                                                        id="oneclickQuotationCountriesSelect"
                                                        value={requestIntries?.country_id}
                                                        onChange={handleChangeCountry}
                                                    >
                                                        <option value="" disabled>Choose Your Country</option>
                                                        {currentCountries?.map((country) => (
                                                            <option key={country?.id} value={country?.id}>{country?.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="singleQuoteInput">
                                                    <label htmlFor="oneclickQuotationCountrCitiesnSelect">
                                                        Choose your City
                                                    </label>
                                                    <select
                                                        className='form-select'
                                                        name="city_id"
                                                        id="oneclickQuotationCitiesSelect"
                                                        value={requestIntries?.city_id}
                                                        onChange={(event) => {
                                                            setRequestIntries({ ...requestIntries, city_id: event?.target?.value })
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose Your City</option>
                                                        {currentCities?.map((city) => (
                                                            <option key={city?.cityId} value={city?.cityId}>{city?.cityName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="selectedProducts__handler">
                                                            <h3>
                                                                Selected Products
                                                            </h3>
                                                            <h4 className={'mt-3 fw-bold fs-5 mb-3'}>Number Of Companies: {cartCompanies || 0}</h4>
                                                            {(cart?.one_click_quotation_cart?.length === 0) ? (
                                                                <p>No products selected</p>
                                                            ) : (
                                                                cart?.one_click_quotation_cart?.map((el) => {
                                                                    return <CartProduct
                                                                        key={el?.one_click_quotation_cart_id}
                                                                        title={el?.item?.title}
                                                                        description={el?.item?.description}
                                                                        notes={el?.note}
                                                                        imageSrc={el?.item?.image ? el?.item?.image : el?.item?.medias[0]?.media}
                                                                        showImage={el?.item?.image ? !!el?.item?.image : !!el?.item?.medias[0]?.media}
                                                                        quantity={el?.quantity}
                                                                        cartId={el?.one_click_quotation_cart_id}
                                                                        token={token}
                                                                        setCart={setCart}
                                                                    />
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="customizationQuote__handler">
                                                    <div className="customization__form row">
                                                        <div className="col-lg-6">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="customProductTitle">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    id="customProductTitle"
                                                                    name="title"
                                                                    className='form-control'
                                                                    type="text"
                                                                    placeholder='L-Shape Sofa-Grey'
                                                                    value={customProduct?.title}
                                                                    onChange={handleCustomProductChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="customProductQuantity">
                                                                    Quantity
                                                                </label>
                                                                <input
                                                                    id="customProductQuantity"
                                                                    name="quantity"
                                                                    className='form-control'
                                                                    type="number"
                                                                    placeholder='0'
                                                                    min={0}
                                                                    value={customProduct?.quantity}
                                                                    onChange={handleCustomProductChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="customProductDescription">
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    id="customProductDescription"
                                                                    name="description"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder='The L-shaped sofa is the relax version of the long sofa. Its main feature is the extended terminal seat, which can be placed on the left or right side, on the basis of the living room design and the personal needs.'
                                                                    value={customProduct?.description}
                                                                    onChange={handleCustomProductChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="customizationQuote__actions singleQuoteInput">
                                                                <label>UpLoad A Reference</label>
                                                                <p className='fw-light mb-2'>It’s recommended to upload a photo or file as a reference for better clarity on your request</p>
                                                                <input
                                                                    type='file'
                                                                    id='customProductImageOneClickQuotation'
                                                                    multiple
                                                                    onChange={handleCustomProductChangeImage}
                                                                    className={`form-control`}
                                                                />
                                                                <span className='pageMainBtnStyle mt-4' onClick={handleAddCustomProduct}>
                                                                    Add Item to Quotation
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="quotaionCheckInputs__handler mt-5">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            name="include_shipping"
                                                            checked={distinationData?.include_shipping}
                                                            onChange={handleCheckboxChange}
                                                            id="flexCheckDefault" />
                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                            Include Shipping
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            name="include_insurance"
                                                            checked={distinationData?.include_insurance}
                                                            onChange={handleCheckboxChange}
                                                            id="flexCheckDefault2" />
                                                        <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                            Include Insurance
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {distinationData?.include_shipping && (
                                                <div className="col-12">
                                                    <DestinationForm isOneClickQuotation={true} countries={countries} distinationData={distinationData} setDistinationData={setDistinationData} />
                                                </div>
                                            )}
                                            <div className="col-12">
                                                <div className="customizationQuote__handler">
                                                    <h3 className='text-capitalize customizationHead'>

                                                    </h3>
                                                    <div className="customization__form row">
                                                        <div className="col-lg-6">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="currency" className='position-relative'>
                                                                    Prefered Currency
                                                                    <i title='write a note for your full quote that very important to you' className="bi bi-info-circle ms-2 cursorPointer " style={{ fontSize: '16px', position: "absolute", top: '2px' }}></i>
                                                                </label>
                                                                <select
                                                                    defaultValue={''}
                                                                    className='form-select w-100'
                                                                    id="currency"
                                                                    name={'currency'}
                                                                    onChange={handleCurrencyChange}
                                                                >
                                                                    <option value='' disabled>Choose your currency</option>
                                                                    {
                                                                        currCurrencies?.map((curr) => (
                                                                            <option key={curr} value={curr}>{curr}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="oneClickQuotationTargetBudget">
                                                                    Add Target Budget
                                                                </label>
                                                                <input
                                                                    id="oneClickQuotationTargetBudget"
                                                                    name="target_budget"
                                                                    type='text'
                                                                    className="form-control customizedInput"
                                                                    defaultValue={distinationData.target_budget}
                                                                    placeholder='5000'
                                                                    onChange={(e) => {
                                                                        setDistinationData({ ...distinationData, [e.target.name]: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="oneClickQuotationTargetDeliveryTime">
                                                                    Expected Delivery Time
                                                                </label>
                                                                <input
                                                                    id="oneClickQuotationTargetDeliveryTime"
                                                                    name="target_delivery_time"
                                                                    type='date'
                                                                    className="form-control customizedInput"
                                                                    defaultValue={distinationData.target_delivery_time}
                                                                    onChange={(e) => {
                                                                        setDistinationData({ ...distinationData, [e.target.name]: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="oneClickQuotationDeliveryTerms">
                                                                    Preferred Delivery Terms
                                                                </label>
                                                                <textarea
                                                                    id="oneClickQuotationDeliveryTerms"
                                                                    name="preferred_delivery_terms"
                                                                    className="form-control customizedInput"
                                                                    rows="3"
                                                                    defaultValue={distinationData.preferred_delivery_terms}
                                                                    placeholder='Add Your Terms'
                                                                    onChange={(e) => {
                                                                        setDistinationData({ ...distinationData, [e.target.name]: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-12">
                                                            <div className="singleQuoteInput">
                                                                <label htmlFor="oneClickQuotationNote">
                                                                    Add Note To One Click Quotation
                                                                </label>
                                                                <textarea
                                                                    id="oneClickQuotationNote"
                                                                    name="user_notes"
                                                                    className="form-control customizedInput"
                                                                    rows="3"
                                                                    defaultValue={distinationData.user_notes}
                                                                    placeholder='Ex: Add any notes or specific terms and conditions for your request in this section.'
                                                                    onChange={(e) => {
                                                                        setDistinationData({ ...distinationData, [e.target.name]: e.target.value });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button disabled={loadingSubmit || cart?.on_click_quotation_cart?.length === 0} className='addedButtonStyle btnSubmitQuote mt-5'>
                                                    Submit quotation
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
            }
        </>
    );
};
