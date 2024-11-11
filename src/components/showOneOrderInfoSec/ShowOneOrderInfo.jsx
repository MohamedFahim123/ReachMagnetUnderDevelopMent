import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import './showOneOrderInfo.css'
import { Table } from 'react-bootstrap';
import defaulImg from '../../assets/servicesImages/default-store-350x350.jpg'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { findRenderedDOMComponentWithTag } from 'react-dom/test-utils';
export default function ShowOneOrderInfo({ token }) {
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [newData, setNewdata] = useState([]);
    const fetchOrderInfo = async () => {
        const slug = loginType === 'user' ? 'show-quotation-order' : 'quotation-order';
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${slug}/${orderId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.quotation_order);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchOrderInfo();
    }, [loginType, token]);
    const taxesPrice = newData?.taxes;
    const shippingPrice = newData?.shipping_price;
    const servicePrice = newData?.services;
    const currencySymbol = newData?.currency_symbol;
    

    const handleChangeStatue = async (id, status) => {        
            await axios.post(`${baseURL}/${loginType}/update-quotation-order-status?t=${new Date().getTime()}`, {
                quotation_order_id: `${id}`,
                status: status
            }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            .then(response => {
                toast.success(response?.data?.message || 'Changed Successfully!');
                fetchOrderInfo();
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            })            
        };


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log(newData);
    
    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler showOneProductInDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container showOneOrder__handler'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
        <div className='content__view__handler'>
            <ContentViewHeader title={`main order Details #${newData?.code} (${newData?.order_type})`} />
            <div className="content__card__list showOrder__handler">
                <div className="row">
                    <div className="col-12 main_header_for_order">
                        <div className="row justify-content-between">
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <p>
                                    <i className="bi bi-calendar me-2"></i>
                                    {newData?.created_at}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 ">
                                <div className="changeOrderStatu__handler ">
                                    <p className={`order__statue ${newData?.order_status}`}>
                                        {newData?.order_status}
                                    </p>
                    {
                        newData?.order_type !== 'buy' && newData?.order_status !== 'Completed'  && loginType !== 'user' && (
                        <select
                            className="changeSatusSelect form-select w-50"
                            onChange={(e) => handleChangeStatue(newData?.id, e.target.value)} 
                            defaultValue=""
                        >
                            <option value="" disabled>Select Status</option> 
                            <option value="Accepted">accepted</option>
                            <option value="processing">Processing</option>
                            <option value="delivering">Delivering</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled_by_admin" disabled>Cancelled by admin</option>
                        </select>
                        )
                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        {
                            newData?.order_type !== 'buy' ?
                            <div className="row">
                            <div className="col-lg-6 col-md-6 sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-person-circle"></i>
                                </div>
                                <p className='specialP'>
                                    Customer Information
                                </p>
                                <h5>
                                    {newData?.order_by_name}                              
                                </h5>
                                <p>
                                    {newData?.order_by_phone}
                                </p>
                                <p>
                                    {newData?.city}
                                </p>
                            </div>
                            <div className="col-lg-6 col-md-6  sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>
                                <p className='specialP'>
                                    Destination & Payment
                                </p>
                                <h5>
                                    {newData?.city}, {newData?.country}
                                </h5>
                                <p>
                                    Adress: {newData?.address}
                                </p>
                            </div>
                            </div>
                            :
                            <div className="row">
                                <div className="col-lg-6 col-md-6 sub_header_for_order">
                                    <div className="icon_handler">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <p className='specialP text-capitalize'>
                                        seller Information
                                    </p>
                                    <h5>
                                        {newData?.company_name}                              
                                    </h5>
                                    <p>
                                        {newData?.company_email}
                                    </p>
                                    <p className='text-capitalize'>
                                        {newData?.city !== 'N/A' ? newData?.city : newData?.address}
                                    </p>
                                </div>
                                <div className="col-lg-6 col-md-6  sub_header_for_order">
                                <div className="icon_handler">
                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>
                                <p className='specialP'>
                                    Destination & Payment
                                </p>
                                {
                                    newData?.city !== 'N/A' && newData?.country !== 'N/A' &&
                                    <h5 className='text-capitalize'>
                                    {newData?.city !== 'N/A' ? `${newData?.city},`  : ''} {newData?.country !== 'N/A' ? newData?.country : ''}
                                    </h5>
                                }
                                
                                <p className='text-capitalize'>
                                    Adress: {newData?.address}
                                </p>
                                <p className='text-capitalize'>
                                    order type: {newData?.order_type}
                                </p>
                            </div>
                            </div>
                        }
                        
                    </div>
                    <div className="col-12">
                        {
                            newData?.length !== 0 ?
<div className="productTable__content">
<Table responsive>
                                        <thead>
            <tr className='table__default__header'>
                <th>
                    product
                </th>
                <th className='text-center'>Qty</th>
                <th className='text-center'>Unit</th>
                
                <th 
                className='text-center'>Total Price</th>
                <th className='text-center'>Notes</th>
                <th className='text-center'>Files</th>
                
            </tr>
                                        </thead>
                                        <tbody>
                                            {newData?.quotation_order_details?.map((row, index) => (
    <tr className='' key={index}>
        <td className='product__breif__detail d-flex '>
            <div className="product__img">
            <img src={
                row?.medias?.length > 0 
                ? row?.medias[0]?.media 
                : row?.image || defaulImg
            } alt="product" />
            </div>
            <div className="product__info">
                <h2 className='cursorPointer' title={row?.title}>
                    {/* {row?.title?.length > 5 ? `${row?.title.substring(0, 5)}...` : row?.title} */}
                    {row?.title} <span className='optional'>
                                    {
                                        row?.code ? `(${row?.code})` : '' 
                                    }
                                </span>
                </h2>
            </div>
        </td>
        <td>
            {row?.quantity}
        </td>
        <td>
        {
            row?.unit_of_measure 
                ? row?.unit_of_measure !== 'N/A' 
                ? row?.unit_of_measure 
                : '' 
                : row?.type === 'service' 
                ? 'services item' 
                : 'Customized Product'
        }
        </td>
        <td>
            {currencySymbol}{row?.total_price}
        </td>
        <td className='text-center'>
        {
        row?.notes !== 'N/A' ?
            <i onClick={handleShow} className="bi bi-eye cursorPointer"></i>
            : 
            'No Notes'
        }
        </td>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Notes</Modal.Title>
            </Modal.Header>
            <Modal.Body>{row?.notes}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        <td className='text-center'>
            <i className="bi bi-cloud-download cursorPointer"></i>
        </td>
    </tr>
))}
    </tbody>
</Table>
<div className="quoteTotals__handler">
        <h3 className='text-capitalize'>
            order Total
        </h3>
        <div className="row align-items-center">
            <div className="col-lg-6">
                <div className="totals__full__info">
                    <div className="totals__text">
                        <h5 className='mb-4'>
                            Sub-Total <span className="optional">(before tax)</span>
                        </h5>
                        {
                            newData?.taxes !== 'N/A' &&
                            <h5 className='mb-4'>
                            Total Tax 
                            </h5>
                        }
                        {
                            
                                <h5 className='mb-4'>
                                    Shipping cost 
                                </h5>
                        }
                        <h5 className='mb-4'>
                            Extra <span className='optional'>(Specified in notes)</span>
                        </h5>
                        <h5>
                            Total Price 
                        </h5>
                    </div>
                    <div className="totals__prices">
                        <h5 className='mb-4 '>
                                $ {newData?.sub_total
                                }
                        </h5>
                        {
                            newData?.taxes !== 'N/A' &&
                            <h5 className='mb-4'>
                                $ {newData?.taxes}
                            </h5>
                        }
                        <h5 className='mb-4 mt-2'>
                                $ {newData?.shipping_price}
                        </h5>
                        <h5 className='mb-4 mt-2'>
                                $ {newData?.services}
                        </h5>
                        <h5 className=' mt-2'>
                                $ {newData?.total_price
                                }
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                                :
                                <div className='row'>
                                    <div className="col-12 text-danger fs-5">
                                        No Product Items Yet
                                    </div>
                                </div>
                        }
                    </div>
                </div>


            </div>

        </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}
