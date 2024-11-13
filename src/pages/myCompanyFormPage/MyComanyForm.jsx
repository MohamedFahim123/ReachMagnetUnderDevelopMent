import React, { useEffect, useState } from 'react';
import styles from './myCompanyForm.module.css';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Modal, Table } from 'react-bootstrap';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import ContentViewHeader from '../../components/contentViewHeaderSec/ContentViewHeader';
import { useDashBoardFormDataStore } from '../../store/DashBoardCompanyForm';

export default function MyCompanyForm({ token }) {
    const loginType = localStorage.getItem('loginType');
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const cookiesData = Cookies.get('currentLoginedData');

    const {
        loading,
        formData,
        unAuth,
        totalPages,
        currentPage,
        selectedFormId,
        showModal,
        fetchFormData,
        deleteFormData,
        setCurrentPage,
        setSelectedFormId,
        closeModal,
    } = useDashBoardFormDataStore();

    useEffect(() => {
        if (!currentUserLogin) {
            setCurrentUserLogin(JSON.parse(cookiesData));
        }
    }, [cookiesData, currentUserLogin]);

    useEffect(() => {
        fetchFormData(token, loginType, currentPage);
    }, [token, loginType, currentPage]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const handleDeleteFormData = (id) => deleteFormData(token, loginType, id);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='dashboard__handler d-flex'>
                    <MyNewSidebarDash />
                    <div className='main__content container'>
                        <MainContentHeader currentUserLogin={currentUserLogin} search={false} />
                        {unAuth ? (
                            <UnAuthSec />
                        ) : (
                            <div className='content__view__handler'>
                                <ContentViewHeader title={'Company Form Data'} />
                                {formData.length ? (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="productTable__content">
                                                <Table responsive>
                                                    <thead>
                                                        <tr className='table__default__header'>
                                                            <th className='text-center'></th>
                                                            <th className='text-center'>Form Name</th>
                                                            <th className='text-center'>Sender Type</th>
                                                            <th className='text-center'>Sent by (Name)</th>
                                                            <th className='text-center'>Sent by (Email)</th>
                                                            <th className='text-center'>Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <i className="bi bi-trash-fill" onClick={() => handleDeleteFormData(row?.formId)}></i>
                                                                </td>
                                                                <td>{row?.formTitle}</td>
                                                                <td>{row?.filled_by_type}</td>
                                                                <td>{row?.filled_by_name}</td>
                                                                <td>{row?.filled_by_email}</td>
                                                                <td>
                                                                    <i onClick={() => setSelectedFormId(row?.formId)} className={`bi bi-eye ${styles.eyeIcon}`}></i>
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className='row'>
                                        <div className="col-12 text-danger fs-5">No Form Data Available</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {selectedFormId && (
                <Modal show={showModal} onHide={closeModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Data Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='row p-4'>
                        {formData
                            .find((row) => row.formId === selectedFormId)
                            ?.data &&
                            Object.entries(
                                formData.find((row) => row.formId === selectedFormId)?.data
                            ).map(([key, value], i) => (
                                <div className={`${styles.formBodyData} col-6`} key={i}>
                                    <h5>{key}:</h5>
                                    <p>
                                        {typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://')) ? (
                                            <NavLink
                                                className={`nav-link ${styles.viewLink}`}
                                                to={value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Link <i className="bi bi-arrow-up-right"></i>
                                            </NavLink>
                                        ) : (
                                            value
                                        )}
                                    </p>
                                </div>
                            ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}
