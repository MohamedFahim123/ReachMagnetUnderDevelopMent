import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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

export default function MyBookedAppointements({ token }) {
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
            date: '',
            type: '', /*reservedByUs || reservedByOthers*/
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

    const fetchBookedAppointments = async () => {
        const slug = loginType !== 'user' ? 'all-booked-appointments' : 'get-user-appointments'
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${slug}?page=${currentPage}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data?.bookedAppointments);
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
        fetchBookedAppointments();
    }, [loginType, token]);

    const filterBooked = async () => {
        const urlParams = objectToParams(filteration);
        if (urlParams) {
            await axios.get(`${baseURL}/${loginType}/filter-booked-appointments?${urlParams}&page=${currentPage}&t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    setNewdata(res?.data?.data?.bookedAppointments);
                })
                .catch(err => {
                    toast.error(err?.response?.data?.message || 'Something Went Wrong!');
                });
        } else {
            fetchBookedAppointments();
        };
    };

    useEffect(() => {
        filterBooked();
      }, [filteration]);

    const handleDeleteThisAppointment = async (id) => {
        try {
            const response = await axios?.delete(`${baseURL}/${loginType}/delete-booked-appointment/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message);
            await fetchBookedAppointments();
        } catch (error) {
            toast.error(error?.response?.data?.message);
        };
    };

    const handleChangeStatue = async (id, status) => {        
        await axios.post(`${baseURL}/${loginType}/update-booked-appointment-status/${id}&t=${new Date().getTime()}`, {
            status: status,
            id: id
        }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            toast.success(response?.data?.message || 'Changed Successfully!');
            fetchBookedAppointments();
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        })            
    };

    const [visibleRowId, setVisibleRowId] = useState(null);

    const toggleOptions = (rowId) => {
        setVisibleRowId(prevId => (prevId === rowId ? null : rowId));
    };
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setVisibleRowId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                            <MainContentHeader currentUserLogin={currentUserLogin} search={loginType !== 'user' ? true : false} filteration={filteration}  name={'date'} placeholder={'Filter by Date'} setFilteration={setFilteration} inputType={'date'}/>
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler'>
                                        <ContentViewHeader
                                            title={
                                                loginType !== 'user'
                                                    ?
                                                    'Company Booked Appointments' : 'User Booked Appointments'
                                            }
                                        />
                {
                    loginType === 'employee' &&
                    <div className="my__roles__actions my-4 ps-0 ms-0">
                        <button
                            className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                            onClick={() => {
                                fetchBookedAppointments();
                                setFilteration({ ...filteration, type: '' })
                                setActiveRole('All')
                            }}
                        >
                            All
                        </button>
                        <button
                            className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`}
                            style={{borderBottomLeftRadius: '0px', borderTopLeftRadius: '0px'}}
                            onClick={() => {
                                setFilteration({...filteration,type: 'reservedByOthers'})
                                setActiveRole('reservedByOthers')
                            }}
                        >
                            Reserved By Others
                        </button>
                        <button
                            className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`}
                            onClick={() =>{
                                setFilteration({...filteration,type: 'reservedByUs'})
                                setActiveRole('reservedByUs')
                            }}
                        >
                            Reserved By Us
                        </button>
                    </div>
                }

            {
                newData?.length !== 0 ?
                <>
                
                <div className="row">
                    <div className="col-12">
                        <div className="productTable__content quotationTable__NewStyle">
                            <Table responsive>
                                <thead>
                                    <tr className='table__default__header'>
                                        <th className=''>From</th>
                                        <th className=''>To</th>
                                        <th className='text-center'>Reason</th>
                                        <th className='text-center'>Date</th>
                                        <th className='text-center'>Time</th>
                                        <th className='text-center'>Status</th>
                                        {
                                            loginType !== 'user' &&
                                            <th className='text-center'>
                                                Actions
                                            </th>
                                        }
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {newData?.map((row, index) => (
                                        <tr className='' key={index}>
                                            <td className='text-start' style={{fontSize: '12px'}}>
                                                <div className={`product__statue text-start`}>
                                                    <p>
                                                    {row?.booked_by_name}
                                                    </p>
                                                    {/* <p>
                                                    {row?.booked_by_email}
                                                    </p> */}
                                                </div>
                                            </td>
                                            <td className='text-start' style={{fontSize: '12px'}}>
                                                <div className="product__created">
                                                    <p>
                                                    {row?.company_name || row?.companyName}
                                                    </p>
                                                    {/* <p>
                                                    {row?.company_email}
                                                    </p> */}
                                                </div>
                                            </td>
                                            <td  style={{fontSize: '12px'}}>
                                                <div className='bookedAppointementReason'>
                                                {row?.reason}
                                                </div>
                                            </td>
                                            <td style={{fontSize: '12px'}}>
                                                {row?.date}
                                            </td>
                                            <td style={{fontSize: '12px'}}>
                                                {row?.time}
                                            </td>
                                            <td style={{fontSize: '12px'}}>
                                               <div className={`bookedAppointementStatus ${row?.status}`}>
                                               {row?.status}

                                               </div>
                                                
                                            </td>
                                            
                                               {
                                                loginType === 'employee' &&
                                                <td style={{fontSize: '12px'}}>
                                                    {
                                                        row?.type === 'reservedByOthers' ?
                                                        <div className='position-relative actions'>
                                                            <i className="bi bi-trash-fill" onClick={() => handleDeleteThisAppointment(row?.id)}></i>
                                                            <i style={{cursor: 'pointer'}} className="bi bi-three-dots-vertical ms-2" onClick={() => toggleOptions(row?.id)}></i>
                                                            {visibleRowId  === row?.id && (
                                            <div className="options-box" ref={optionsRef}>
                                            <p className="option mb-1 text-danger" onClick={() => handleChangeStatue( row?.id, 'rejected')}>Reject</p>
                                            <p className=" option mb-0 text-success" onClick={() => handleChangeStatue(row?.id, 'accepted')}>Accept</p>
                                        </div>
                                        )}
                                                        </div>
                                                        :
                                                        'No Action'
                                                    }
                                                    
                                                </td>
                                               }
                                                
                                            
                                            
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
                                        <i className="bi bi-caret-right-fill"></i>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                </>
                
                :
                <div className='row'>
                    <div className="col-12 my-5 text-danger fs-5">
                        No Booked Appointements Yet
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
