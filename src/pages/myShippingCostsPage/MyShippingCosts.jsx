import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import AddNewItem from '../../components/addNewItemBtn/AddNewItem';

export default function MyShippingCosts({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [newData, setNewdata] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        };
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const fetchShippingCosts = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/shipping-costs?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.shipping_costs);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    useEffect(() => {
        fetchShippingCosts();
    }, [loginType, token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handleDeleteThisShippingCost = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/shipping-costs-delete/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchShippingCosts();
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
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
                                        <ContentViewHeader title={'Shipping Costs'} />
                                        <AddNewItem link={'/profile/shipping-costs/addNewCost'} />
                                        {
                                            newData?.length !== 0 ?
                                                <div className="productTable__content">
                                                    <Table responsive>
                                                        <thead>
                                                            <tr className='table__default__header'>
                                                                <th className='ps-4'>
                                                                    Country
                                                                </th>
                                                                <th className='text-center'>City</th>
                                                                <th className='text-center'>Shipping Cost</th>
                                                                <th className='text-center'>currency Type</th>
                                                                <th className='text-center'>Update Cost</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {newData?.map((row, index) => (
                                                                <tr className='' key={index}>
                                                                    <td className=' text-start'>
                                                                        <i className="bi bi-trash-fill me-2" onClick={() => handleDeleteThisShippingCost(row?.id)}></i>
                                                                        {row?.country}
                                                                    </td>
                                                                    <td >
                                                                        {row?.city}
                                                                    </td>
                                                                    <td>
                                                                        {row?.cost}
                                                                    </td>
                                                                    <td>
                                                                        {row?.currency_code}
                                                                    </td>
                                                                    <td>
                                                                        <NavLink className={'nav-link'} to={`/profile/shipping-costs/edit-item/${row?.id}`}>
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
