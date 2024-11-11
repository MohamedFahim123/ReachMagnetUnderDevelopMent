import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import frame from '../../assets/aboutReach/Frame 1321315457.png'
import { getYoutubeVideoId } from '../../functions/getYoutubeVideo';

export default function MyMedia({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newData, setNewdata] = useState([]);
    const [unAuth, setUnAuth] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeRole, setActiveRole] = useState('All');
    const [filteration, setFilteration] = useState(
        {
            type: '',
        }
    );

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

    const fetchMedias = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/company-portfolios?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.portfolio);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            }
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
    };

    const filterMedias = async () => {
        const urlParams = objectToParams(filteration);
        if (urlParams) {
            await axios.get(`${baseURL}/${loginType}/filter-company-portfolios?${urlParams}&page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setNewdata(res?.data?.data?.portfolio);
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message || 'Something Went Wrong!');
                });
        } else {
            fetchMedias();
        };
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        fetchMedias();
    }, [loginType, token]);

    useEffect(() => {
        filterMedias();
      }, [filteration]);

    const handleDeleteThisService = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-company-portfolio/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchMedias();
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
                            <MainContentHeader currentUserLogin={currentUserLogin} search={false} name={'title'} placeholder={'search service'} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'Medias For Company'} />
                                        <AddNewItem link={'/profile/media/addNewItem'} />
                                        <div className="content__card__list">
                                        {
                loginType === 'employee' &&
                <div className="my__roles__actions mb-5 ps-0 ms-0">
                    <button
                        className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                        onClick={() => {
                            fetchMedias();
                            setFilteration({ ...filteration, type: '' })
                            setActiveRole('All')
                        }}
                    >
                        All
                    </button>
                    <button
                        className={`def__btn meddle_btn px-5 ${activeRole === 'image' ? 'rolesActiveBtn' : ''}`}
                        style={{borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}
                        onClick={() => {
                            setFilteration({...filteration,type: 'image'})
                            setActiveRole('image')
                        }}
                    >
                        Image
                    </button>
                    <button
                        className={`cust__btn px-5 ${activeRole === 'link' ? 'rolesActiveBtn' : ''}`}
                        onClick={() =>{
                            setFilteration({...filteration, type: 'link'})
                            setActiveRole('link')
                        }}
                    >
                        Video
                    </button>
                </div>
            }
                {
                    newData?.length !== 0 ?
                        <div className="row">
                            {
                                newData?.map((el) => {
                                    return (
                                        <div className='col-lg-6 d-flex justify-content-center mb-3' key={el?.id}>
                                            <div className="card__item">
                                                <div className="card__image">
                                                    {
                                                        el?.type !== 'link' ?
                                                        ( <img src={el?.link} alt={el?.id} />)
                                                        : 
                                                        (
                                                            
                                                            <iframe
                                                            width="289px"
                                                            height="191px"
                                                            src={`https://www.youtube.com/embed/${getYoutubeVideoId(el?.link)}`}
                                                            title="YouTube video"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            ></iframe>
                                                        )
                                                    }
                                                    
                                                </div>
                                                <div className="card__btns d-flex">
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteThisService(el?.id)}
                                                            className='btn__D'>
                                                            Delete
                                                        </button>
                                                    </>
                                                    <>
                                                        <button className='btn__E' onClick={() => navigate(`/profile/media/edit-item/${el?.id}`)}>
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
                                No Media Items Yet
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
