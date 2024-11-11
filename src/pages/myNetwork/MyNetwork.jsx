import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { Table } from 'react-bootstrap';

export default function MyNetwork({ token }) {
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

    const fetchNetwork = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-company-networks?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.networks);
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
            fetchNetwork();
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
        fetchNetwork();
    }, [loginType, token]);

    const handleDeleteThisNetwork = async (id) => {
        await axios?.delete(`${baseURL}/${loginType}/delete-company-network/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response?.data?.message || 'Deleted Successufuly');
                fetchNetwork();

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
    console.log(newData);
    
    return (
        <>
        {
        loading ?
          <MyLoader />
          :
          <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
              <MainContentHeader currentUserLogin={currentUserLogin} />
              {
                unAuth ?
                  <UnAuthSec />
                  :
                  <div className='myProducts__handler content__view__handler'>
                    <ContentViewHeader title={'Company Network'} />
                    <AddNewItem link={'/profile/network/addNewItem'} />
                    {
                      newData?.length !== 0 ?
                        <div className="productTable__content">
                          <Table responsive>
                            <thead>
                              <tr className='table__default__header'>
                                <th>
                                  logo
                                </th>
                                <th className='text-center'>name</th>
                                <th className='text-center'>label</th>
                                <th className='text-center'>Edit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newData?.map((row, index) => (
                                <tr className='' key={index}>
                                  <td className='product__breif__detail d-flex '>
                                    <i className="bi bi-trash-fill" onClick={() => handleDeleteThisNetwork(row?.id)}></i>
                                    <div className="product__img">
                                      <img src={row?.logo} alt="product" />
                                    </div>
                                  </td>
                                  <td>
                                    {row?.name}
                                  </td>
                                  <td>
                                    <div className="product__created">
                                      {row?.label}
                                    </div>
                                  </td>
                                  <td>
                                    
                                    <NavLink className={'nav-link'} to={`/profile/network/edit-item/${row?.id}`}>
                                    <i className="bi bi-pencil-square"></i>
                                    </NavLink>
                                  </td>
                                  
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
                        :
                        <div className='row'>
                          <div className="col-12 text-danger fs-5">
                            No Network Yet
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
