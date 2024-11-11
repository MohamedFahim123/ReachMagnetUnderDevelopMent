import React, { useEffect, useState } from 'react'
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader'
import { NavLink, useNavigate } from 'react-router-dom'
import { Table } from 'react-bootstrap';
import './myProducts.css'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';

export default function MyProducts({ token }) {
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-products?page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewdata(response?.data?.data?.products);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [loginType, token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  const handleDeleteThisProduct = async (id) => {
    try {
      const response = await axios?.delete(`${baseURL}/${loginType}/delete-product-data/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(response?.data?.message);
      await fetchProducts();
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data?.message);
    }
  };

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
              <MainContentHeader currentUserLogin={currentUserLogin} />
              {
                unAuth ?
                  <UnAuthSec />
                  :
                  <div className='myProducts__handler content__view__handler'>
                    <ContentViewHeader title={'E-Commerce Products'} />
                    <AddNewItem link={'/profile/products/addNewItem'} />
                    {
                      newData?.length !== 0 ?
                        <div className="productTable__content">
                          <Table responsive>
                            <thead>
                              <tr className='table__default__header'>
                                <th>
                                  product
                                </th>
                                <th className='text-center'>Category</th>
                                <th className='text-center'>Origin</th>
                                <th className='text-center'>Stock</th>
                                {/* <th className='text-center'>Edit</th> */}
                                <th className='text-center'>Show</th>
                              </tr>
                            </thead>
                            <tbody>
                              {newData?.map((row, index) => (
                                <tr className='' key={index}>
                                  <td className='product__breif__detail d-flex '>
                                    <i className="bi bi-trash-fill" onClick={() => handleDeleteThisProduct(row?.id)}></i>
                                    <div className="product__img">
                                      <img src={row?.images[0]?.image ? row?.images[0]?.image : ''} alt="product" />
                                    </div>
                                    <div className="product__info">
                                      <h2>
                                        {row?.title}
                                      </h2>
                                      
                                    </div>
                                  </td>
                                  <td>
                                    <div className="product__created">
                                      {row?.category}
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`product__statue`}>
                                      {row?.origin}
                                    </div>
                                  </td>
                                  <td>
                                    {row?.total_stock}
                                  </td>
                                  {/* <td>
                                    <button className='btn__E tableEditBtn nav-link' onClick={() => navigate(`/profile/products/edit-item/${row?.id}`)}>
                                      <i className="bi bi-pencil-square"></i>
                                    </button>
                                  </td> */}
                                  <td>
                                    <NavLink className={'nav-link'} to={`/profile/products/show-one/${row?.id}`}>
                                      <i className="bi bi-eye-fill showProd"></i>
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
  );
};
