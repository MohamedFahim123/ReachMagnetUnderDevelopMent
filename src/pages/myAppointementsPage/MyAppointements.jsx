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
import { Table } from 'react-bootstrap';

export default function MyAppointements({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newData, setNewdata] = useState([]);
    const [unAuth, setUnAuth] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/appointments?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.appointments);
            setTotalPages(response?.data?.data?.meta?.last_page);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            }
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };
    useEffect(() => {
        fetchAppointments();
    }, [loginType, token]);

    const handleDeleteThisAppointment = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-appointments/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchAppointments();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
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
                            <MainContentHeader currentUserLogin={currentUserLogin} search={false} name={'title'} placeholder={'search service'} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader title={'Company Appointments'} />
                                        <AddNewItem link={'/profile/appointments/addNewAppointment'} />
        {
            newData?.length !== 0 ?
                <div className="row">
                    <div className="col-12">
                        <div className="productTable__content">
                            <Table responsive>
                                <thead>
                                    <tr className='table__default__header'>
                                        <th className='text-center'>
                                        </th>
                                        <th className='text-center'>Date From</th>
                                        <th className='text-center'>Date To</th>
                                        <th className='text-center'>Available From</th>
                                        <th className='text-center'>Available To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newData?.map((row, index) => (
                                        <tr className='' key={index}>
                                            <td >
                                                
                                                <i className="bi bi-trash-fill" onClick={() => handleDeleteThisAppointment(row?.id)}></i>
                                            </td>
                                            <td>
                                                <div className="product__created">
                                                    {row?.date_from}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`product__statue`}>
                                                    {row?.date_to}
                                                </div>
                                            </td>
                                            <td>
                                                {row?.available_from}
                                            </td>
                                            <td>
                                                {row?.available_to}
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
                    </div>
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
