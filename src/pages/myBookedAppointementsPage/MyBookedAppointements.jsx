import React, { useEffect, useState } from 'react';
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

    const handleChangeStatus = (id, status) => updateAppointmentStatus(token, loginType, id, status);

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
                                {loginType === 'employee' && (
                                    <div className="my__roles__actions my-4 ps-0 ms-0">
                                        <button className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`} onClick={() => {
                                            fetchBookedAppointments(token, loginType, currentPage, { ...filteration, type: '' });
                                            setActiveRole('All');
                                        }}>All</button>
                                        <button className={`def__btn meddle_btn px-5 ${activeRole === 'reservedByOthers' ? 'rolesActiveBtn' : ''}`} onClick={() => {
                                            setFilteration({ ...filteration, type: 'reservedByOthers' });
                                            setActiveRole('reservedByOthers');
                                        }}>Reserved By Others</button>
                                        <button className={`cust__btn px-5 ${activeRole === 'reservedByUs' ? 'rolesActiveBtn' : ''}`} onClick={() => {
                                            setFilteration({ ...filteration, type: 'reservedByUs' });
                                            setActiveRole('reservedByUs');
                                        }}>Reserved By Us</button>
                                    </div>
                                )}
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
                                                                <td>{row?.booked_by_name}</td>
                                                                <td>{row?.company_name || row?.companyName}</td>
                                                                <td>{row?.reason}</td>
                                                                <td>{row?.date}</td>
                                                                <td>{row?.time}</td>
                                                                <td><span className={`bookedAppointementStatus ${row?.status}`}>{row?.status}</span></td>
                                                                {loginType === 'employee' && (
                                                                    <td>
                                                                        {row?.type === 'reservedByOthers' ? (
                                                                            <div className='position-relative actions'>
                                                                                <i className="bi bi-trash-fill" onClick={() => handleDeleteAppointment(row?.id)}></i>
                                                                                <i className="bi bi-three-dots-vertical ms-2" onClick={() => handleChangeStatus(row?.id, 'rejected')}></i>
                                                                                <i className="bi bi-check-lg ms-2" onClick={() => handleChangeStatus(row?.id, 'accepted')}></i>
                                                                            </div>
                                                                        ) : 'No Action'}
                                                                    </td>
                                                                )}
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
                </div>
            )}
        </>
    );
}
