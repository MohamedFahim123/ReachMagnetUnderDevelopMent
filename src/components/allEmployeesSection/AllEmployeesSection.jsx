import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import { Table } from 'react-bootstrap';

export default function AllEmployeesSection({ token }) {
  const [unAuth, setUnAuth] = useState(false);
  const loginType = localStorage.getItem('loginType');
  const [allEmployees, setAllEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllEmployees = async (page = 1) => {
    await axios.get(`${baseURL}/${loginType}/all-employees?page=${page}?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setAllEmployees(response?.data?.data?.employees);
        setTotalPages(response?.data?.data?.meta?.last_page);
      })
      .catch(error => {
        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message || 'Something Went Wrong!');
      });
  };

  const handleDeleteThisEmployee = async (id) => {
    await axios.delete(`${baseURL}/${loginType}/delete-employee/${id}?t=${new Date().getTime()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        getAllEmployees(currentPage);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || `Something Went Wrong!`);
      });
  };

  useEffect(() => {
    getAllEmployees(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {
        unAuth ?
          <UnAuthSec />
          :
          <>
            <div className='myProducts__handler content__view__handler'>
              {
                allEmployees?.length !== 0 ?
                  <div className="productTable__content">
                    <Table responsive>
                      <thead>
                        <tr className='table__default__header'>
                          <th className='ps-5'>
                            Employee
                          </th>
                          <th className='text-center'>Role</th>
                          <th className='text-center'>Phone</th>
                          <th className='text-center'>Address</th>
                          {/* <th className='text-center'>Show</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {allEmployees?.map((row, index) => (
                          <tr className='' key={index}>
                            <td className='product__breif__detail d-flex '>
                              <i className="bi bi-trash-fill" onClick={() => handleDeleteThisEmployee(row?.id)}></i>
                              <div className="product__img">
                                <img src={row?.image} alt="product" />
                              </div>
                              <div className="product__info">
                                <h2>
                                  {row?.name}
                                </h2>
                                <p>
                                  {row?.title}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className="product__created">
                                {row?.role}
                              </div>
                            </td>
                            <td>
                              <div className={`product__statue ${row?.status}`}>
                                {row?.phone}
                              </div>
                            </td>
                            <td>
                              {row?.country}, {row?.city}
                            </td>
                            {/* <td>
                              <NavLink className={'nav-link'} to={`/profile/products/show-one/${row?.id}`}>
                                <i className="bi bi-eye-fill showProd"></i>
                              </NavLink>
                            </td> */}
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
                      No Employees Yet
                    </div>
                  </div>
              }
            </div>
          </>
      }
    </>
  );
};
