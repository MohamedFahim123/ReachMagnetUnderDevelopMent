import React, { useEffect, useState } from 'react'
import styles from './myCompanyForm.module.css'
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { Button, Modal, Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';

export default function MyComanyForm({token}) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newData, setNewdata] = useState([]);
    const [unAuth, setUnAuth] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    function objectToParams(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== '') {
                params.append(key, obj[key]);
            };
        };
        return params.toString();
    };

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchFormData = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-form-data?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.formData);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            }
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        fetchFormData();
    }, [loginType, token]);

    const handleDeleteThisformData = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-form-data/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchFormData();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const [selectedFormId, setSelectedFormId] = useState(null);
    const [show, setShow] = useState(false);

  const handleShow = (formId) => {
    setSelectedFormId(formId); 
    setShow(true); 
  };
  const handleClose = () => {
    setSelectedFormId(null); 
    setShow(false); 
  };
  return (
    <>
      {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} search={false} name={'title'} placeholder={'search service'} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'Company Form Data'} />
        {
            newData?.length !== 0 ?
                <div className="row">
                    <div className="col-12">
                        <div className="productTable__content">
                            <Table responsive>
                                <thead>
                                    <tr className='table__default__header'>
                                        <th className='text-center'>
                                        </th>
                                        <th className='text-center'>Form Name</th>
                                        <th className='text-center'>Sender Type</th>
                                        <th className='text-center'>Sent by (Name)</th>
                                        <th className='text-center'>Sent by (Email)</th>
                                        <th className='text-center'>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newData?.map((row, index) => (
                                        <tr className='' key={index}>
                                            <td >
                                                <i className="bi bi-trash-fill" onClick={() => handleDeleteThisformData(row?.formId)}></i>
                                            </td>
                                            <td>
                                                <div className="product__created">
                                                    {row?.formTitle}
                                                </div>
                                            </td>
                                            <td>
                                                <div className='bookedAppointementReason'>
                                                {row?.filled_by_type}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`product__statue`}>
                                                    {row?.filled_by_name}
                                                </div>
                                            </td>
                                            <td>
                                                {row?.filled_by_email}
                                            </td>
                                            <td>
                                                <i onClick={()=>handleShow(row?.formId)} className={`bi bi-eye ${styles.eyeIcon}`}></i>
                                            </td>
                                            <>
                {selectedFormId === row?.formId && (
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{`${row?.formTitle} Data`}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='row p-4'>
                        { 
                                row?.data && Object.entries(row?.data).map(([key, value], i) => (
                                    <div className={`${styles.formBodyData} col-6`} key={i}  >
                                        <h5>{key}:</h5> 
                                        <p>
                                        {typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://')) ? (
                                            <NavLink className={`nav-link ${styles.viewLink}`} to={value}  target="_blank" rel="noopener noreferrer">View Link <i className="bi bi-arrow-up-right"></i>

                                            </NavLink>
                                        ) : value}
                                        </p>
                                        
                                    </div>
                                ))
                        }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                </Modal>
                )}
                
                                            </>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {
                                totalPages > 1 &&
                                <div className="d-flex justify-content-center align-items-center mt-4">
                                    <button
                                        type="button"
                                        className="paginationBtn me-2"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <i class="bi bi-caret-left-fill"></i>
                                    </button>
                                    <span className='currentPagePagination'>{currentPage}</span>
                                    <button
                                        type="button"
                                        className="paginationBtn ms-2"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <i class="bi bi-caret-right-fill"></i>
                                    </button>
                                </div>
                            }
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
                            }
                        </div>
                    </div>
            }
    </>
  )
}
