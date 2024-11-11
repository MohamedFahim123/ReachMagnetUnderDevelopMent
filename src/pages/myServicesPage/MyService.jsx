import React, { useEffect, useState } from 'react';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import Cookies from 'js-cookie';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { NavLink, useNavigate } from 'react-router-dom';

export default function MyService({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newData, setNewdata] = useState([]);
    const [unAuth, setUnAuth] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterService, setFilterService] = useState({
        status: 'active',
        title: ''
    })
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

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-services?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.services);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            }
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
    };

    const filterServices = async () => {
        let urlParams = undefined;
        if ([...filterService?.title].length >= 3) {
            urlParams = objectToParams(filterService)
        }
        if (urlParams) {
            await axios.get(`${baseURL}/${loginType}/filter-services?${urlParams}&page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setNewdata(res?.data?.data?.services);
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message || 'Something Went Wrong!');
                });
        } else {
            fetchServices();
        };
    };

    useEffect(() => {
        filterServices();
    }, [filterService]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        fetchServices();
    }, [loginType, token]);

    const handleDeleteThisService = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-service/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchServices();
        } catch (error) {
            toast.error(error?.response?.data?.message);
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
                            <MainContentHeader currentUserLogin={currentUserLogin} search={true} filteration={filterService} setFilteration={setFilterService} name={'title'} placeholder={'search service'} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'Services'} />
                                        <AddNewItem link={'/profile/service/addNewItem'} />
            <div className="content__card__list">
                {
                    newData?.length !== 0 ?
                        <div className="row">
                            {
                                newData?.map((el) => {
                                    return (
                                        <div className='col-lg-6 d-flex justify-content-center mb-3' key={el?.id}>
                                            <div className="card__item">
                                                <div className="card__image">
                                                    <img src={el?.image} alt={el?.title} />
                                                </div>
                                                <NavLink className={'nav-link'} to={`/profile/service/show-one/${el?.id}`}>
                                                <div className="card__name">
                                                <h3>
                                                    {el?.title}
                                                    <i className="bi bi-box-arrow-in-up-right"></i>
                                                </h3>
                                                <p>
                                                    ({el?.code})
                                                </p>
                                                </div>
                                                </NavLink>
                                                <div className="card__btns d-flex">
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteThisService(el?.id)}
                                                            className='btn__D'>
                                                            Delete
                                                        </button>
                                                    </>
                                                    <>
                                                        <button className='btn__E' onClick={() => navigate(`/profile/service/edit-item/${el?.id}`)}>
                                                            Edit
                                                        </button>
                                                    </>
                                                </div>
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
                                No Service Items Yet
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
    )
}
