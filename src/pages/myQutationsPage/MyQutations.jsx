import React, { useEffect } from 'react';
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec';
import QuotationTableSec from '../../components/quotationTableSecc/QuotationTableSec';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import { useDashBoardQuotationStore } from '../../store/DashBoardQuotations';
import Cookies from 'js-cookie';

export default function MyQuotations({ token }) {
  const {
    loading,
    quotations,
    unAuth,
    totalPages,
    currentPage,
    filteration,
    fetchAllQuotations,
    filterQuotations,
    setCurrentPage,
    setFilteration,
  } = useDashBoardQuotationStore();
  const loginType = localStorage.getItem('loginType');
  const cookiesData = Cookies.get("currentLoginedData");
  const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;

  useEffect(() => {
    if (token) {
      fetchAllQuotations(token, loginType, currentPage);
    }
  }, [token, loginType, currentPage, fetchAllQuotations]);

  useEffect(() => {
    filterQuotations(token, loginType, currentPage, filteration);
  }, [filteration, token, loginType, currentPage, filterQuotations]);

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        <div className="dashboard__handler d-flex">
          <MyNewSidebarDash />
          <div className="main__content container">
            <MainContentHeader
              currentUserLogin={currentUserLogin}
              search={true}
              placeholder={'Quotation Code'}
              filteration={filteration}
              name={'code'}
              setFilteration={setFilteration}
            />
            <div className="myQuotations__handler ">
              <QuotationStateSec />
              {unAuth ? (
                <UnAuthSec />
              ) : (
                <QuotationTableSec
                  fetchAllQuotations={() => fetchAllQuotations(token, loginType, currentPage)}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  quotations={quotations}
                  filteration={filteration}
                  setFilteration={setFilteration}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
