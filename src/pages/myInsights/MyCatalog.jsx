import React, { useEffect, useState } from 'react'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import './catalogContent.css';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast';
import MyLoader from '../../components/myLoaderSec/MyLoader'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import Cookies from 'js-cookie';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem'
import { NavLink, useNavigate } from 'react-router-dom';

export default function MyCatalog({ token }) {
  const [loading, setLoading] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [newData, setNewdata] = useState([]);
  const navigate = useNavigate();
  const [unAuth, setUnAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCatalog, setFilterCatalog] = useState({
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

  const fetchCatalogs = async () => {
    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-catalogs?page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewdata(response?.data?.data?.catalogs);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    }
  };

  const filterCatalogs = async () => {
    let urlParams = undefined;
    if ([...filterCatalog?.title].length >= 3) {
      urlParams = objectToParams(filterCatalog)
    }
    if (urlParams) {
      await axios.get(`${baseURL}/${loginType}/filter-catalogs?${urlParams}&page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setNewdata(res?.data?.data?.catalogs);
        })
        .catch(err => {
          toast.error(err?.response?.data?.message || 'Something Went Wrong!');
        });
    } else {
      fetchCatalogs();
    };
  };
  
  useEffect(() => {
    filterCatalogs();
  }, [filterCatalog]);
  
  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  useEffect(() => {
    fetchCatalogs();
  }, [loginType, token]);

  const handleDeleteThisCatalog = async (id) => {
    await axios?.delete(`${baseURL}/${loginType}/delete-catalog/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        toast.success(response?.data?.message || 'Deleted Successufuly');
        fetchCatalogs();
        
      })
      .catch(error => {
        toast.error(error?.response?.data?.message);
      })
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
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
              <MainContentHeader currentUserLogin={currentUserLogin} search={true} filteration={filterCatalog} setFilteration={setFilterCatalog} name={'title'} placeholder={'search catalog'}/>
              {
                unAuth ?
                  <UnAuthSec />
                  :
                  <div className='content__view__handler'>
                    <ContentViewHeader title={'Product Catalogs'} />
                    <AddNewItem link={'/profile/catalog/addNewItem'} />
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
                                        <img src={el?.media[0]?.image} alt={el?.title} />
                                      </div>
                                      <NavLink className={'nav-link'} to={`/profile/catalogs/show-one/${el?.id}`}>
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
                                          <button onClick={() => handleDeleteThisCatalog(el?.id)} className='btn__D'>
                                            Delete
                                          </button>
                                        </>
                                        <>
                                          <button className='btn__E' onClick={() => navigate(`/profile/catalog/edit-item/${el?.id}`)}>
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
                              No Catalog Items Yet
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
