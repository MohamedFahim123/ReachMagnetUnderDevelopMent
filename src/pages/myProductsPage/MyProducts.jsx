import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import './myProducts.css';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import Cookies from 'js-cookie';
import { useDashBoardProductsStore } from '../../store/DashBoardProducts';

export default function MyProducts({ token }) {
  const loginType = localStorage.getItem('loginType');
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const cookiesData = Cookies.get('currentLoginedData');

  const {
    loading,
    products,
    unAuth,
    totalPages,
    currentPage,
    fetchProducts,
    deleteProduct,
    setCurrentPage,
  } = useDashBoardProductsStore();

  useEffect(() => {
    if (!currentUserLogin) {
      setCurrentUserLogin(JSON.parse(cookiesData));
    }
  }, [cookiesData, currentUserLogin]);

  useEffect(() => {
    fetchProducts(token, loginType, currentPage);
  }, [token, loginType, currentPage]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const handleDeleteProduct = (id) => deleteProduct(token, loginType, id);

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        <div className='dashboard__handler d-flex'>
          <MyNewSidebarDash />
          <div className='main__content container'>
            <MainContentHeader currentUserLogin={currentUserLogin} />
            {unAuth ? (
              <UnAuthSec />
            ) : (
              <div className='myProducts__handler content__view__handler'>
                <ContentViewHeader title={'E-Commerce Products'} />
                <AddNewItem link={'/profile/products/addNewItem'} />
                {products.length ? (
                  <div className="productTable__content">
                    <Table responsive>
                      <thead>
                        <tr className='table__default__header'>
                          <th>Product</th>
                          <th className='text-center'>Category</th>
                          <th className='text-center'>Origin</th>
                          <th className='text-center'>Stock</th>
                          <th className='text-center'>Show</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((row, index) => (
                          <tr key={index}>
                            <td className='product__breif__detail d-flex'>
                              <i className="bi bi-trash-fill" onClick={() => handleDeleteProduct(row?.id)}></i>
                              <div className="product__img">
                                <img src={row?.images[0]?.image || ''} alt="product" />
                              </div>
                              <div className="product__info">
                                <h2>{row?.title}</h2>
                              </div>
                            </td>
                            <td className="text-center">{row?.category}</td>
                            <td className="text-center">{row?.origin}</td>
                            <td className="text-center">{row?.total_stock}</td>
                            <td className="text-center">
                              <NavLink className={'nav-link'} to={`/profile/products/show-one/${row?.id}`}>
                                <i className="bi bi-eye-fill showProd"></i>
                              </NavLink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                          type="button"
                          className="paginationBtn me-2"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <i className="bi bi-caret-left-fill"></i>
                        </button>
                        <span className='currentPagePagination'>{currentPage}</span>
                        <button
                          type="button"
                          className="paginationBtn ms-2"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <i className="bi bi-caret-right-fill"></i>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='row'>
                    <div className="col-12 text-danger fs-5">
                      No Product Items Yet
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
