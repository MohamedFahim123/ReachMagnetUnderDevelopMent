import React, { useEffect, useState } from 'react'
import QuotationStateSec from '../../components/quotationsStateSecc/QuotationStateSec'
import QuotationTableSec from '../../components/quotationTableSecc/QuotationTableSec'
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader'
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash'
import MyLoader from '../../components/myLoaderSec/MyLoader'
import Cookies from 'js-cookie'
import UnAuthSec from '../../components/unAuthSection/UnAuthSec'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'

export default function MyQutations({ token }) {
  const [loading, setLoading] = useState(true);
  const loginType = localStorage.getItem('loginType')
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const [unAuth, setUnAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newData, setNewdata] = useState([]);
  const [filteration, setFilteration] = useState(
    {
      type: '',
      date_from: '',
      date_to: '',
      code: '',
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

  const fetchAllQuotations = async () => {
    const slug = loginType === 'user' ? `${loginType}/my-quotations`
      :
      `${loginType}/all-quotations`
    try {
      const response = await axios.get(`${baseURL}/${slug}?page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewdata(response?.data?.data?.quotations);
      setTotalPages(response?.data?.data?.meta?.last_page);
    } catch (error) {
      if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data.message || 'Something Went Wrong!');
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllQuotations();
    };
  }, [loginType, token]);

  const filterQuotation = async () => {
    const urlParams = objectToParams(filteration);
    if (urlParams) {
      await axios.get(`${baseURL}/${loginType}/filter-quotations?${urlParams}&page=${currentPage}?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setNewdata(res?.data?.data?.quotations);
        })
        .catch(err => {
          toast.error(err?.response?.data?.message || 'Something Went Wrong!');
        });
    } else {
      fetchAllQuotations();
    };
  };
  useEffect(() => {
    filterQuotation();
  }, [filteration]);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

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
              <MainContentHeader search={true} placeholder={'Quotation Code'} filteration={filteration} name={'code'} setFilteration={setFilteration} currentUserLogin={currentUserLogin} />
              <div className='myQuotations__handler '>
                <QuotationStateSec />
                {
                  unAuth ?
                    <UnAuthSec />
                    :
                    <QuotationTableSec
                      fetchAllQuotations={fetchAllQuotations}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                      setTotalPages={setTotalPages}
                      newData={newData}
                      setNewdata={setNewdata}
                      filteration={filteration} setFilteration={setFilteration} filterQuotation={filterQuotation} setUnAuth={setUnAuth} token={token} />
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}
