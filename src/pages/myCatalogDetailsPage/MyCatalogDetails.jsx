import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useCatalogStore } from '../../store/SingleCatalog';

export default function MyCatalogDetails({ token }) {
    const { catalogId } = useParams();
    const loginType = localStorage.getItem('loginType');

    const { currentCatalog, loading, fetchCatalog } = useCatalogStore();
    const [currImages, setCurrentImages] = useState([]);
    const [currImg, setCurrImg] = useState('');
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        fetchCatalog(catalogId, token);
    }, [catalogId, token, loginType, fetchCatalog]);

    useEffect(() => {
        if (currentCatalog?.media) {
            setCurrImg(currentCatalog?.media[0]?.image || '');
            setCurrentImages(currentCatalog?.media?.slice(0, 5));
        }
    }, [currentCatalog?.media]);

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
                                        <Swiper
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
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
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
                                                    <img className='swiperSlideSecondaryImg' src={img?.image} alt='product details' />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className='productDetails__description mt-md-4'>
                                    <h2 className='productDetails__head text-capitalize'>{currentCatalog?.title}</h2>
                                    <p className='mt-3 mb-4 fs-5 text-capitalize'>{currentCatalog?.description}</p>
                                    <p className="productDetails__price">
                                        {currentCatalog?.price_after_tax} {currentCatalog?.currency}
                                    </p>
                                    <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <span>Sold by <strong>{currentCatalog?.company_name}</strong></span>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
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
                                    <div className="row prodDetailsChangeColorSpan">
                                        <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>catalog type:</h4>
                                        {currentCatalog?.catalogTypes?.map((prod, index) => (
                                            <div className="col-lg-12" key={index}>
                                                <p className='fw-bold fs-5 text-capitalize'>
                                                    type ({index + 1}): <span className='fw-medium ms-3 fs-6'>{prod?.type}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}
