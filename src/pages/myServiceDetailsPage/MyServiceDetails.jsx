import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
import { useServiceStore } from '../../store/SingleService';

export default function MyServiceDetails({ token }) {
    const { servId } = useParams();
    const loginType = localStorage.getItem('loginType');

    const { currentService, loading, fetchService } = useServiceStore();

    useEffect(() => {
        fetchService(servId, token);
    }, [servId, token, loginType, fetchService]);

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
                                    <Col md={12} className='activeImage'>
                                        <div className="imgContainer">
                                            <img src={currentService?.image} alt="product Details" />
                                        </div>
                                    </Col>
                                    <Col lg={12} className='sliderOfProductDetails'>
                                        <div className="imgContainer">
                                            <img src={currentService?.image} alt="product Details" />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className='productDetails__description mt-md-4'>
                                    <h2 className='productDetails__head text-capitalize'>
                                        {currentService?.title}
                                    </h2>
                                    <p className='mt-3 mb-4 fs-5 text-capitalize'>
                                        {currentService?.description}
                                    </p>
                                    <p className="productDetails__price">
                                        {currentService?.price_after_tax || ''} {currentService?.currency}
                                    </p>
                                    <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                        <span>
                                            Sold by <strong>{currentService?.company_name}</strong>
                                        </span>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className='productDetails__content mb-5 mt-4'>
                                    <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>
                                        Description
                                    </h4>
                                    <p className='mt-3 mb-4 fs-5'>{currentService?.description}</p>
                                    <div className="row prodDetailsChangeColorSpan">
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                category:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.category}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                sub category:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.subCategory}</span>
                                            </p>
                                        </div>
                                        <div className="col-lg-12 mb-3">
                                            <p className='fw-medium text-capitalize fs-4'>
                                                item code:
                                                <span className='fw-medium ms-2 fs-5'>{currentService?.code}</span>
                                            </p>
                                        </div>
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
