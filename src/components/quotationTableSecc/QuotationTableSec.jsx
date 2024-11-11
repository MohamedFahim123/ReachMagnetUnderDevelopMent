import React, {  useState } from 'react'
import './quotationTableSec.css'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function QuotationTableSec({fetchAllQuotations ,newData , setCurrentPage , currentPage ,totalPages , filteration , setFilteration  }) {
    const [activeRole, setActiveRole] = useState('All');
    const loginType = localStorage.getItem('loginType');

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        };
    };

    return (
        <div className='quotationTable__handler content__view__handler'>
            {
                loginType === 'employee' &&
                <div className="my__roles__actions mb-5 ps-0 ms-0">
                    <button
                        className={`def__btn px-5 ${activeRole === 'All' ? 'rolesActiveBtn ' : ''}`}
                        onClick={() => {
                            fetchAllQuotations();
                            setFilteration({ ...filteration, type: '' })
                            setActiveRole('All')
                        }}
                    >
                        All
                    </button>
                    <button
                        className={`def__btn meddle_btn px-5 ${activeRole === 'Sell' ? 'rolesActiveBtn' : ''}`}
                        onClick={() => {
                            setFilteration({...filteration,type: 'sell'})
                            setActiveRole('Sell')
                        }}
                    >
                        Sell
                    </button>
                    <button
                        className={`cust__btn px-5 ${activeRole === 'Buy' ? 'rolesActiveBtn' : ''}`}
                        onClick={() =>{
                            setFilteration({...filteration,type: 'buy'})
                            setActiveRole('Buy')
                        }}
                    >
                        Buy
                    </button>
                </div>
            }
            <ContentViewHeader title={'All Quotations'} />
            {
                loginType === 'employee' &&
                <div className="quotationTable__content">
                    <Table responsive>
                        <thead>
                            <tr className='table__default__header'>
                                <th>ID</th>
                                <th>Subm-Date</th>
                                <th>Expi-Date</th>
                                <th>Requested By</th>
                                <th>Destination</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                newData?.map((row, index) => (
                                    <tr key={index}>
                                        <td className='mx-0 px-0'>
                                            <NavLink to={`/profile/quotations/${row?.id}`} className={'nav-link fw-bold'}>
                                                {row?.code === 'N/A' ? '' : row?.code}
                                            </NavLink>
                                        </td>
                                        <td >{row?.created_at === 'N/A' ? 'InProgress' : row?.created_at}</td>
                                        <td >{row?.valid_to === 'N/A' ? 'InProgress' : row?.valid_to}</td>
                                        <td>{row?.requested_by_name}</td>
                                        <td >{row?.country === 'N/A' ? 'No Shipping' : row?.country}</td>
                                        <td className=''>
                                            <button className={`${row?.user_status} table__statu__btn`}>
                                                {row?.user_status}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
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
            }
            {
                loginType === 'user' &&
                <div className="quotationTable__content">
                    <Table responsive>
                        <thead>
                            <tr className='table__default__header'>
                                <th>ID</th>
                                <th>Submission Date</th>
                                <th>Expiration Date</th>
                                <th>Requested From</th>
                                <th>Country</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                newData?.map((row, index) => (
                                    <tr key={index}>
                                        <td className='mx-0 px-0'>
                                            <NavLink to={`/profile/quotations/${row?.id}`} className={'nav-link fw-bold'}>
                                                {row?.code === 'N/A' ? '' : row?.code}
                                            </NavLink>
                                        </td>
                                        <td >{row?.created_at === 'N/A' ? 'InProgress' : row?.created_at}</td>
                                        <td >{row?.valid_to === 'N/A' ? 'InProgress' : row?.valid_to}</td>
                                        <td>{row?.company_name}</td>
                                        <td >{row?.country === 'N/A' ? 'No Shipping' : row?.country}</td>
                                        <td className='adjust__flex'>
                                            <button className={`${row?.company_status} table__statu__btn`}>
                                                {row?.company_status}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
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
            }

        </div>
    )
}
