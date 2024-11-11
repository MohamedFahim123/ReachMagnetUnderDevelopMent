import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { Col, Container, Row } from 'react-bootstrap';
export default function MyServiceDetails({ token }) {
    const { servId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentCatalog, setCurrentCatalog] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const getCurrentService = async () => {
        setLoading(true);
        await axios.get(`${baseURL}/show-service/${servId}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCurrentCatalog(response?.data?.data?.catalog);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!', {
                    duration: 1000
                });
            });
        setLoading(false);
    };

    useEffect(() => {
        getCurrentService();
    }, [token, loginType]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='productDetailsPage'>
                        <Container className='productDetails__sec mb-5 mt-3'>
                            <Row>
                                <Col lg={8}>
                                    <Row>
                                        <Col md={12} className='activeImage'>
                                            <div className="imgContainer">
                                                <img src={currentCatalog?.image} alt="product Details" />
                                            </div>
                                        </Col>
                                        <Col lg={12} className='sliderOfProductDetails'>
                                            <div className="imgContainer">
                                                <img src={currentCatalog?.image} alt="product Details" />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={4}>
                                    <div className='productDetails__description mt-md-4'>
                                        <h2 className='productDetails__head text-capitalize'>
                                            {currentCatalog?.title}
                                        </h2>

                                        <p className='mt-3 mb-4 fs-5 text-capitalize'>
                                            {currentCatalog?.description}
                                        </p>
                                        <p className="productDetails__price">
                                            {currentCatalog?.price_after_tax ? currentCatalog?.price_after_tax : ''} {currentCatalog?.currency}
                                        </p>
                                        <p className='productDetails__soldBy d-flex gap-2 align-items-center my-4 '>
                                            <span>
                                                Sold by
                                                <strong>{currentCatalog?.company_name}</strong>
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
                                        <p className='mt-3 mb-4 fs-5'>
                                            {currentCatalog?.description}
                                        </p>
                                        <>
                                            <div className="row prodDetailsChangeColorSpan">

                                                <div className="col-lg-6 mb-3">
                                                    <p className='fw-medium text-capitalize fs-4'>
                                                        category:
                                                        <span className='fw-medium ms-2 fs-5'>
                                                            {currentCatalog?.category}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="col-lg-6 mb-3">
                                                    <p className='fw-medium text-capitalize fs-4'>
                                                        Sub Category:
                                                        <span className='fw-medium ms-2 fs-5'>
                                                            {currentCatalog?.subCategory}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    <p className='fw-medium text-capitalize fs-4'>
                                                        item code:
                                                        <span className='fw-medium ms-2 fs-5'>
                                                            {currentCatalog?.code}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
            }
        </>
    )
}
