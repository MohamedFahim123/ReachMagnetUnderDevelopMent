import React, { useEffect, useState } from 'react'
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import OneClickQuotationTable from '../../components/oneClickQuotationTableSec/OneClickQuotationTable';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function OneClickQuotationsDashboard({ token }) {
  const [loading, setLoading] = useState(true);
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);
  const [filteration,setFilteration] = useState({
    code: '',
    type: '',
  });
  const loginType = localStorage.getItem("loginType");
  const [newData, setNewdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  const fetchAllQuotations = async () => {
    const slug =
      loginType === "user"
        ? `${loginType}/my-one-click-quotations`
        : `${loginType}/all-one-click-quotations`;
    try {
      const response = await axios.get(
        `${baseURL}/${slug}?page=${currentPage}?t=${new Date().getTime()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewdata(response?.data?.data?.one_click_quotations);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    };
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [loading]);

  function objectToParams(obj) {
    const params = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        params.append(key, obj[key]);
      };
    };
    return params.toString();
  };

  const filterQuotation = async () => {
    const urlParams = objectToParams(filteration);
    if (urlParams) {
      await axios.get(`${baseURL}/${loginType}/filter-one-click-quotations?${urlParams}&page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setNewdata(res?.data?.data?.one_click_quotations);
        })
        .catch(err => {
          toast.error(err?.response?.data?.message || 'Something Went Wrong!');
        });
    } else {
      fetchAllQuotations();
    };
  };

  useEffect(()=>{
    filterQuotation();
  },[filteration]);

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
          <div className='dashboard__handler d-flex'>
            <MyNewSidebarDash />
            <div className='main__content container'>
              <MainContentHeader name='code' search={true} filteration={filteration} placeholder={'Quotation Code'} setFilteration={setFilteration} currentUserLogin={currentUserLogin} />
              <div className='myQuotations__handler '>
                <QuotationStateSec />
                {
                  unAuth ?
                    <UnAuthSec />
                    :
                    <OneClickQuotationTable 
                      filteration={filteration} 
                      setFilteration={setFilteration} 
                      setUnAuth={setUnAuth} 
                      token={token} 
                      fetchAllQuotations={fetchAllQuotations}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      newData={newData}
                      totalPages={totalPages}
                    />
                }
              </div>
            </div>
          </div>
      }
    </>
  );
};
