import React, { useEffect, useState } from 'react';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import './myFaqs.css'
import MyLoader from '../../components/myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { useNavigate } from 'react-router-dom';

export default function MyFaqs({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchAllFaqs = async () => {
        await axios.get(`${baseURL}/${loginType}/all-faqs?page=${currentPage}?t=${new Date().getTime()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setNewdata(response?.data?.data?.faqs);
                setTotalPages(response?.data?.data?.meta?.last_page);
            }).catch((error) => {
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data.message || 'Something Went Wrong!');
            });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        fetchAllFaqs();
    }, [loginType, token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handleDeleteThisFaq = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-faq/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchAllFaqs()
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='dashboard__handler allFaqsDash__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'FAQs'} />
                                        <AddNewItem link={'/profile/faqs/addNewItem'} />
                                        <div className="content__card__list">
                                            {
                                                newData?.length !== 0 ?
                                                    <div className="row">
                                                        {
                                                            newData?.map((el) => {
                                                                return (
                                                                    <div key={el?.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                                                        <div className='singleCompany__rectangleSec-slide'>
                                                                            <div className='deleteFaq__btn'>
                                                                                <i className="bi bi-x-circle text-danger" onClick={() => handleDeleteThisFaq(el?.id)}></i>
                                                                            </div>
                                                                            <h4>{el?.question}</h4>
                                                                            <p className='d-flex justify-content-between'>
                                                                                <span>{el?.answer}</span>
                                                                                <i className="bi bi-pencil-square text-primary fs-6 tableEditBtn cursorPointer"
                                                                                    onClick={() => navigate(`/profile/faqs/edit-item/${el?.id}`)}
                                                                                ></i>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            totalPages > 1 &&
                                                            <div className="col-12 d-flex justify-content-center align-items-center mt-4">
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
                                                    :
                                                    <div className='row'>
                                                        <div className="col-12 text-danger fs-5">
                                                            No Faqs Items Yet
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};
