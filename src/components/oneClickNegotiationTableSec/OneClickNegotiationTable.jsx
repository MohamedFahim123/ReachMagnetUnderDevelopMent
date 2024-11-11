import React, { useEffect, useState } from "react";
import ContentViewHeader from "../contentViewHeaderSec/ContentViewHeader";
import { Table } from "react-bootstrap";
import axios from "axios";
import { baseURL } from "../../functions/baseUrl";
import { NavLink, useParams } from "react-router-dom";
import { scrollToTop } from "../../functions/scrollToTop";
import toast from "react-hot-toast";

export default function OneClickNegotiationTable({ token, setUnAuth }) {
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);
  const [fullData, setFulldata] = useState([]);
  const { negotiateId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShowQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/show-single-one-click-quotation`
        : `${loginType}/show-one-click-quotation`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}/${negotiateId}?page=${currentPage}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewdata(response?.data?.data?.one_click_quotation?.negotiate_one_click_quotation);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Error!');
    };
  };

  useEffect(() => {
    fetchShowQuotations();
  }, [loginType, token]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    };
  };

  return (
    <div className="quotationTable__handler content__view__handler">
      <ContentViewHeader title={`All Requested Companies`} />
      <div className="quotationTable__content">
        <Table responsive>
          <thead>
            <tr className="table__default__header">
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {newData?.map((row, index) => (
              <tr className="" key={index}>
                <td>
                  {row?.company_name}
                </td>
                <td className="adjust__flex">
                  <button className={`${row?.company_status} table__statu__btn`}>
                    {row?.company_status}
                  </button>
                  <NavLink
                    className={"nav-link"}
                    onClick={() => {
                      scrollToTop();
                    }}
                    to={`/profile/oneclick-quotations/${negotiateId}/${row?.id}`}
                  >
                    {
                      <button className={`table__statu__btn show__btn`}>
                        <span>show</span>
                        <i className="bi bi-eye"></i>
                      </button>
                    }
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
    </div>
  );
}
