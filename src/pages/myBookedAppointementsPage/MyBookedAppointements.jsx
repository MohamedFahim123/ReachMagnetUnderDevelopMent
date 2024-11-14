import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { useDashBoardBookedAppointmentsStore } from '../../store/DashBoardBookedAppointMents';

export default function MyBookedAppointments({ token }) {
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const cookiesData = Cookies.get('currentLoginedData');
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

    const {
        loading,
        appointments,
        unAuth,
        totalPages,
        currentPage,
        filteration,
        activeRole,
        fetchBookedAppointments,
        deleteAppointment,
        updateAppointmentStatus,
        setCurrentPage,
        setFilteration,
        setActiveRole,
    } = useDashBoardBookedAppointmentsStore();

    useEffect(() => {
        if (!currentUserLogin) setCurrentUserLogin(JSON.parse(cookiesData));
    }, [cookiesData, currentUserLogin]);

    useEffect(() => {
        fetchBookedAppointments(token, loginType, currentPage, filteration);
    }, [token, loginType, currentPage, filteration]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const handleDeleteAppointment = (id) => deleteAppointment(token, loginType, id);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='dashboard__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader
                            currentUserLogin={currentUserLogin}
                            search={loginType !== 'user'}
                            filteration={filteration}
                            setFilteration={setFilteration}
                            name='date'
                            placeholder='Filter by Date'
                            inputType='date'
                        />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={loginType !== 'user' ? 'Company Booked Appointments' : 'User Booked Appointments'} />
                                {/* {loginType === 'employee' && (
                                    <div className="my__roles__actions my-4 ps-0 ms-0">
                                        <button className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('All', token, loginType)}>
                                            All
                                        </button>
                                        <button className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('reservedByOthers', token, loginType)}>
                                            Reserved By Others
                                        </button>
                                        <button className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => setActiveRole('reservedByUs', token, loginType)}>
                                            Reserved By Us
                                        </button>
                                    </div>
                                )} */}
                                {
                                    loginType === 'employee' &&
                                    <div className="my__roles__actions my-4 ps-0 ms-0">
                                        <button
                                            className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                                            onClick={() => {
                                                fetchBookedAppointments();
                                                setFilteration({ ...filteration, type: '' })
                                                setActiveRole('All', token, loginType)
                                            }}
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`}
                                            style={{ borderBottomLeftRadius: '0px', borderTopLeftRadius: '0px' }}
                                            onClick={() => {
                                                setFilteration({ ...filteration, type: 'reservedByOthers' })
                                                setActiveRole('reservedByOthers', token, loginType)
                                            }}
                                        >
                                            Reserved By Others
                                        </button>
                                        <button
                                            className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`}
                                            onClick={() => {
                                                setFilteration({ ...filteration, type: 'reservedByUs' })
                                                setActiveRole('reservedByUs', token, loginType)
                                            }}
                                        >
                                            Reserved By Us
                                        </button>
                                    </div>
                                }
                                {appointments.length ? (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="productTable__content quotationTable__NewStyle">
                                                <Table responsive>
                                                    <thead>
                                                        <tr className='table__default__header'>
                                                            <th>From</th>
                                                            <th>To</th>
                                                            <th className='text-center'>Reason</th>
                                                            <th className='text-center'>Date</th>
                                                            <th className='text-center'>Time</th>
                                                            <th className='text-center'>Status</th>
                                                            {loginType === 'employee' && <th className='text-center'>Actions</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {appointments.map((row, index) => (
                                                            <tr key={index}>
                                                                <td className='text-start' style={{ fontSize: '12px' }}>
                                                                    <div className={`product__statue text-start`}>
                                                                        <p>
                                                                            {row?.booked_by_name}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className='text-start' style={{ fontSize: '12px' }}>
                                                                    <div className="product__created">
                                                                        <p>
                                                                            {row?.company_name || row?.companyName}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td style={{ fontSize: '12px' }}>
                                                                    <div className='bookedAppointementReason'>
                                                                        {row?.reason}
                                                                    </div>
                                                                </td>
                                                                <td>{row?.date}</td>
                                                                <td>{row?.time}</td>
                                                                <td><span className={`bookedAppointementStatus ${row?.status}`}>{row?.status}</span></td>
                                                                {
                                                                    loginType === 'employee' &&
                                                                    <td style={{ fontSize: '12px' }}>
                                                                        {
                                                                            row?.type === 'reservedByOthers' ?
                                                                                <div className='position-relative actions'>
                                                                                    <i className="bi bi-trash-fill" onClick={() => handleDeleteAppointment(row?.id)}></i>
                                                                                    <i style={{ cursor: 'pointer' }} className="bi bi-three-dots-vertical ms-2" onClick={() => toggleOptions(row?.id)}></i>
                                                                                    {visibleRowId === row?.id && (
                                                                                        <div className="options-box" ref={optionsRef}>
                                                                                            <p className="option mb-1 text-danger" onClick={() => {
                                                                                                updateAppointmentStatus(token, loginType, row?.id, 'rejected');
                                                                                                setVisibleRowId(null);
                                                                                            }}>Reject</p>
                                                                                            <p className=" option mb-0 text-success" onClick={() => {
                                                                                                updateAppointmentStatus(token, loginType, row?.id, 'accepted');
                                                                                                setVisibleRowId(null);
                                                                                            }}>Accept</p>
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
                                                {totalPages > 1 && (
                                                    <div className="d-flex justify-content-center align-items-center mt-4">
                                                        <button className="paginationBtn me-2" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                                            <i className="bi bi-caret-left-fill"></i>
                                                        </button>
                                                        <span className='currentPagePagination'>{currentPage}</span>
                                                        <button className="paginationBtn ms-2" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                                                            <i className="bi bi-caret-right-fill"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row'>
                                        <div className="col-12 my-5 text-danger fs-5">
                                            No Booked Appointments Yet
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div >
            )
            }
        </>
    );
}
//
