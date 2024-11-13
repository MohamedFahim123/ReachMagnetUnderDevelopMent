import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';
import { useNetworkStore } from '../../store/DashBoardNetwork';

export default function MyNetwork({ token }) {
  const loginType = localStorage.getItem('loginType');

  const {
    loading,
    networks,
    unAuth,
    totalPages,
    currentPage,
    filterCatalog,
    fetchNetwork,
    filterCatalogs,
    deleteNetwork,
    setCurrentPage,
    setFilterCatalog
  } = useNetworkStore();

  // Fetch networks with pagination and filters
  useEffect(() => {
    if (filterCatalog.title.length >= 3 || filterCatalog.status) {
      filterCatalogs(token, loginType, currentPage, filterCatalog);
    } else {
      fetchNetwork(token, loginType, currentPage);
    }
  }, [token, loginType, currentPage, filterCatalog, filterCatalogs, fetchNetwork]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteThisNetwork = (id) => {
    deleteNetwork(token, loginType, id);
  };

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        <div className="dashboard__handler d-flex">
          <MyNewSidebarDash />
          <div className="main__content container">
            <MainContentHeader />
            {unAuth ? (
              <UnAuthSec />
            ) : (
              <div className="myProducts__handler content__view__handler">
                <ContentViewHeader title="Company Network" />
                <AddNewItem link="/profile/network/addNewItem" />
                {networks.length !== 0 ? (
                  <div className="productTable__content">
                    <Table responsive>
                      <thead>
                        <tr className="table__default__header">
                          <th>Logo</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Label</th>
                          <th className="text-center">Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {networks.map((row, index) => (
                          <tr key={index}>
                            <td className="product__breif__detail d-flex">
                              <i
                                className="bi bi-trash-fill"
                                onClick={() => handleDeleteThisNetwork(row?.id)}
                              ></i>
                              <div className="product__img">
                                <img src={row?.logo} alt="network logo" />
                              </div>
                            </td>
                            <td>{row?.name}</td>
                            <td>
                              <div className="product__created">{row?.label}</div>
                            </td>
                            <td>
                              <NavLink className="nav-link" to={`/profile/network/edit-item/${row?.id}`}>
                                <i className="bi bi-pencil-square"></i>
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
                        <span className="currentPagePagination">{currentPage}</span>
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
                  <div className="row">
                    <div className="col-12 text-danger fs-5">No Network Yet</div>
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
