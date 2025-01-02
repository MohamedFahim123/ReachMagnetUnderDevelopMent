import React from 'react';
import './quotationTableSec.css';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useDashBoardQuotationStore } from '../../store/DashBoardQuotations';

export default function QuotationTableSec({ fetchAllQuotations, quotations, setCurrentPage, currentPage, totalPages }) {
    const { activeRole, setActiveRole, filteration } = useDashBoardQuotationStore(); // Use activeRole from store
    const loginType = localStorage.getItem('loginType');

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };
console.log(quotations);

    return (
        <div className="quotationTable__handler content__view__handler">
            {loginType === 'employee' && (
                <div className="my__roles__actions mb-5 ps-0 ms-0">
                    <button
                        className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('All')}
                    >
                        All
                    </button>
                    <button
                        className={`def__btn meddle_btn px-5 ${activeRole === 'Sell' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('Sell')}
                    >
                        Sell
                    </button>
                    <button
                        className={`cust__btn px-5 ${activeRole === 'Buy' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => setActiveRole('Buy')}
                    >
                        Buy
                    </button>
                </div>
            )}
            <ContentViewHeader title="All Quotations" />
            <div className="quotationTable__content">
                <Table responsive>
                    <thead>
                        <tr className="table__default__header">
                            <th>ID</th>
                            <th>Subm-Date</th>
                            <th>Expi-Date</th>
                            <th>{loginType === 'user' ? 'Requested From' : 'Requested By'}</th>
                            <th>Destination</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations?.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <NavLink to={`/profile/quotations/${row?.code}`} className="nav-link fw-bold">
                                        {row?.code === 'N/A' ? '' : row?.code}
                                    </NavLink>
                                </td>
                                <td>{row?.created_at === 'N/A' ? 'InProgress' : row?.created_at}</td>
                                <td>{row?.valid_to === 'N/A' ? 'InProgress' : row?.valid_to}</td>
                                <td>{loginType === 'user' ? row?.company_name : row?.requested_by_name}</td>
                                <td>{row?.country === 'N/A' ? 'No Shipping' : row?.country}</td>
                                <td>
                                    <button className={`${loginType === 'user' ? row?.company_status : row?.user_status} table__statu__btn`}>
                                        {loginType === 'user' ? row?.company_status : row?.user_status}
                                    </button>
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
        </div>
    );
}
