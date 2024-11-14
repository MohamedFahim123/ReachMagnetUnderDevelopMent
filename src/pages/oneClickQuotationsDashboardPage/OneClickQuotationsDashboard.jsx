import React, { useEffect } from 'react';
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import OneClickQuotationTable from '../../components/oneClickQuotationTableSec/OneClickQuotationTable';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import { useDashBoardOneClickQuotationStore } from '../../store/DashBoardOneClickQutations';
import Cookies from 'js-cookie';

export default function OneClickQuotationsDashboard({ token }) {
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
  } = useDashBoardOneClickQuotationStore();
  const cookiesData = Cookies.get("currentLoginedData");
  const currentUserLogin = cookiesData ? JSON.parse(cookiesData) : null;
  const loginType = localStorage.getItem("loginType");

  useEffect(() => {
    if (filteration.code || filteration.type) {
      filterQuotations(token, loginType, filteration, currentPage);
    } else {
      fetchAllQuotations(token, loginType, currentPage);
    }
  }, [filteration, currentPage, token, loginType]);

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
              name='code'
              search={true}
              filteration={filteration}
              placeholder='Quotation Code'
              setFilteration={setFilteration}
            />
            <div className='myQuotations__handler '>
              <QuotationStateSec />
              {unAuth ? (
                <UnAuthSec />
              ) : (
                <OneClickQuotationTable
                  filteration={filteration}
                  setFilteration={(newFilter) => setFilteration({ ...filteration, ...newFilter })}
                  token={token}
                  fetchAllQuotations={() => fetchAllQuotations(token, loginType, currentPage)}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  newData={quotations}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
