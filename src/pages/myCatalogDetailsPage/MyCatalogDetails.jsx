import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useCatalogStore } from '../../store/SingleCatalog';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import Cookies from 'js-cookie';
import ProductDetailsFilterationBar from '../../components/productDetailsFilterationBarSec/ProductDetailsFilterationBar';

export default function MyCatalogDetails({ token }) {
    const { catalogId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate()
    const { currentCatalog, loading, fetchCatalog } = useCatalogStore();
    const [currImages, setCurrentImages] = useState([]);
    const [currImg, setCurrImg] = useState('');
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [addedPreferences, setAddedPreferences] = useState([]);

    useEffect(() => {
        fetchCatalog(catalogId, token);
    }, [catalogId, token, loginType, fetchCatalog]);

    useEffect(() => {
        if (currentCatalog?.media) {
            setCurrImg(currentCatalog?.media[0]?.image || '');
            setCurrentImages(currentCatalog?.media?.slice(0, 5));
        }
    }, [currentCatalog?.media]);

console.log(addedPreferences);


    const handleAddProduct = (product) => {
        const preferences = Object.values(addedPreferences);
        const addedProduct = {
            type:  product?.type,
            item_id: `${product?.id}`,
            // preferences: addedPreferences
            preferences
        };
        (async () => {
            const toastId = toast.loading('Loading...');
            await axios.post(`${baseURL}/user/add-item-to-quotation-cart?t=${new Date().getTime()}`,
                addedProduct
                , {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {
                    toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                        id: toastId,
                        duration: 1000
                    });
                    console.log(addedProduct);
                    
                    fetchCatalog(catalogId, token);
                })
                .catch((error) => {
                    // Handle error response
                    const errorMessage =
                        error?.response?.data?.message || 'Something went wrong!';
                    const errorDetails =
                        error?.response?.data?.errors || {}; // Object containing validation errors
                    
                    // Show the primary error message
                    toast.error(errorMessage, {
                        id: toastId,
                        duration: 3000,
                    });
        
                    // Display specific validation errors (e.g., from preferences)
                    if (errorDetails.preferences && Array.isArray(errorDetails.preferences)) {
                        errorDetails.preferences.forEach((err) => {
                            toast.error(err, {
                                duration: 3000,
                            });
                        });
                    }
                });
        })();
    };

        const [activeItem, setActiveItem] = useState('About');

        const items = [
        { name: 'About', active: activeItem === 'About' },
        { name: 'Options', active: activeItem === 'Options' },
        ];

        const handleItemClick = (itemName) => {
            setActiveItem(itemName);
        };
    
    console.log(currentCatalog);
    
    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='productDetailsPage'>
                    <Container className='productDetails__sec mb-5 mt-3'>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col md={2}>
                                        <div className="d-flex flex-column justify-content-between sideImagesContainer">
                                            {currImages?.map((img, index) => (
                                                <div key={index} className="imgContainer">
                                                    <img
                                                        onClick={() => setCurrImg(img?.image || img?.media)}
                                                        src={img?.image || img?.media}
                                                        alt='product details'
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                    <Col md={10} className='activeImage'>
                                        <div className="imgContainer">
                                            <img src={currImg} alt="product Details" />
                                        </div>
                                    </Col>
                                    <Col lg={12} className='sliderOfProductDetails'>
                                    {currImages?.length > 0 &&  thumbsSwiper?.destroyed !== true && (
                                        <Swiper
                                        key={thumbsSwiper ? thumbsSwiper.activeIndex : 'initial'}
                                            style={{
                                                '--swiper-navigation-color': '#969696',
                                                '--swiper-pagination-color': '#969696',
                                            }}
                                            spaceBetween={10}
                                            navigation={true}
                                            thumbs={{ swiper: thumbsSwiper }}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="mySwiper2"
                                        >
                                            {currImages?.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img className='activeImgInSlider' src={img?.image} alt='product details' />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                    {currImages?.length > 0 && (
                                        <Swiper
                                            // onSwiper={setThumbsSwiper}
                                            onSwiper={(swiper) => {
                                                if (!swiper.destroyed) {
                                                    setThumbsSwiper(swiper);
                                                }
                                            }}
                                            spaceBetween={5}
                                            slidesPerView={1}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="mySwiper mb-4"
                                            breakpoints={{
                                                200: {
                                                    slidesPerView: 2,
                                                },
                                                400: {
                                                    slidesPerView: 3,
                                                },
                                                500: {
                                                    slidesPerView: 5,
                                                },
                                            }}
                                        >
                                            {currImages?.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img className='swiperSlideSecondaryImg' src={img?.image} alt='product detailss' />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className='productDetails__description mt-md-4'>
                                    <h2 className='productDetails__head text-capitalize'>{currentCatalog?.title}</h2>
                                    <p className='mt-3 mb-4 fs-5 text-capitalize'>{currentCatalog?.description}</p>
                                    {
                                    currentCatalog?.price_after_tax !== 'N/A' &&
                                        <p className="productDetails__price">
                                        <span style={{color:'gray', fontWeight:'normal', fontSize:'18px', textTransform:'capitalize'}}>starting from</span> <br/>
                                        {currentCatalog?.price_after_tax} {currentCatalog?.currency}
                                        </p>
                                    }
                                    <div className="row prodDetailsChangeColorSpan my-3">
                                        {currentCatalog?.catalogTypes?.map((prod, index) => (
                                            <div className="col-lg-12" key={index}>
                                                <p className='fw-bold fs-5 text-capitalize mb-2 d-flex align-items-center'>
                                                <i className="bi bi-check-circle"></i>                                             <span className='fw-medium ms-2 fs-6'>{prod?.type}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="companyQutation__btn my-4">
                                    {
                                    token ? (
                                        <>
                                            {localStorage.getItem('loginType') === 'user' && Cookies.get('verified') === 'false' ? (
                                                // Unverified user
                                                <button
                                                    onClick={() => {
                                                        toast.error('You need to verify your account first!');
                                                        setTimeout(() => {
                                                            navigate('/user-verification');
                                                        }, 1000);
                                                    }}
                                                    className='btnColoredBlue'
                                                >
                                                    Add to Quotation
                                                </button>
                                            ) : currentCatalog?.in_cart === false ? (
                                                // Verified user or other login types
                                                <button
                                                    onClick={() => handleAddProduct(currentCatalog)}
                                                    className='btnColoredBlue'
                                                >
                                                    Add to Quotation
                                                </button>
                                            ) : (
                                                <NavLink
                                                    to={`/${currentCatalog?.company_name}/request-quote`}
                                                    className={'nav-link'}
                                                >
                                                    <p className='text-capitalize' style={{ color: 'rgb(63, 215, 86)' }}>
                                                        view in Quotation cart <i className="bi bi-box-arrow-up-right"></i>
                                                    </p>
                                                </NavLink>
                                            )}
                                        </>
                                    ) : (
                                        // Unauthenticated user
                                        <NavLink to={'/login'} className={'nav-link'}>
                                            <button className='btnColoredBlue'>Add to Quotation</button>
                                        </NavLink>
                                    )
                                    }
                                    </div>
                                    
                                    <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <span>Sold by <strong>{currentCatalog?.company_name}</strong></span>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className='my-5'>
                                <ProductDetailsFilterationBar items={items} onItemClick={handleItemClick} />
                                </div>
                                {
                                    activeItem === 'About' &&
                                    <>
                                    <div className='productDetails__content mb-5 mt-4'>
                                    <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>Description</h4>
                                    <p className='mt-3 mb-4 fs-5'>{currentCatalog?.description}</p>
                                    <div className="row prodDetailsChangeColorSpan">
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                price before tax: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.price} {currentCatalog?.currency}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                tax: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.tax} {currentCatalog?.currency}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                price after tax: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.price_after_tax} {currentCatalog?.currency}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                item code: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.code}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                category: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.category}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                sub category: <span className='fw-medium ms-2 fs-5'>{currentCatalog?.subCategory}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-12 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                unit of measure: <span className='fw-medium limitedP ms-2 fs-5'>{currentCatalog?.unit_of_measure}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {/* <div className="row prodDetailsChangeColorSpan">
                                        <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>catalog type:</h4>
                                        {currentCatalog?.catalogTypes?.map((prod, index) => (
                                            <div className="col-lg-12" key={index}>
                                                <p className='fw-bold fs-5 text-capitalize'>
                                                    type ({index + 1}): <span className='fw-medium ms-3 fs-6'>{prod?.type}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div> */}
                                    </div>
                                    </>
                                }
                                {
                                     activeItem === 'Options' && 
                                     <>
                                     <div className='productDetails__content mb-5 mt-4 ms-5'>
                                     {
                                        currentCatalog?.options?.map((option)=>(
                                            <div className='fw-medium text-capitalize fs-4 mt-4'>
                                                <h4 className='productDetails__contentHead my-2 fs-4 fw-semibold text-capitalize'>{option?.attribute}</h4>
                                                <div className='d-flex gap-5'>
                                                {
                                                    option?.values.map((value,index)=>(
                                                        <div style={{
                                                            // backgroundColor:'rgba(211, 212, 219, 0.5)', 
                                                            padding:'4px', borderRadius:'5px',
                                                        }} key={index} className='mt-2 d-flex gap-2 align-items-center'>
                                                        <input 
                                                        className='form-check cursorPointer'
                                                        type="radio" 
                                                        id={`option-${value.id}
                                                        `}
                                                        name={`option-${option.attribute_id}`} 
                                                        value={value.id}
                                                        checked={addedPreferences[option.attribute_id] === String(value.id)} // Check based on attribute_id
                                                        onChange={() => {
                                                            // Update the state with the selected value for this attribute_id
                                                            setAddedPreferences((prev) => ({
                                                                ...prev,
                                                                [option.attribute_id]: String(value.id), // Update or add the selected value for the group
                                                            }));
                                                        }}
                                                        />
                                                        <label className='text-capitalize' htmlFor={`option-${value.id}`}>{value.name}</label>
                                                        <p style={{
                                                            color: 'gray',
                                                            fontSize:'18px'
                                                        }} className='ms-2 d-block'>
                                                            <span>price impact: </span>
                                                        {value?.price}  {currentCatalog?.currency}
                                                        </p>
                                                        </div>
                                                    ))
                                                }
                                                </div>
                                            </div>
                                        ))
                                     }
                                     {/* <p className='mt-3 mb-4 fs-5'>     {currentCatalog?.options}
                                     </p> */}
                                     </div>
                                     </>
                                }
                                
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}
