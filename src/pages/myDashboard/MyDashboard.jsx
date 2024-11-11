import React, { useEffect, useState } from 'react';
import './companyDashboard.css';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import CompanyDashboardProfileForm from '../../components/companyDashboardProfileFormSec/CompanyDashboardProfileForm';
import Cookies from 'js-cookie';
import UpdatePassword from '../../components/updatePasswordSec/UpdatePassword';
import MyLoader from '../../components/myLoaderSec/MyLoader';

localStorage.setItem('updatingProfile', 'notUpdating');
localStorage.setItem('updatingData', 'profile');

export default function MyDashboard({ token, countries }) {
  const [loading, setLoading] = useState(true);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState(localStorage.getItem('updatingProfile'));
  const [updatingData, setUpdatingData] = useState(localStorage.getItem('updatingData'));
  const [currentUserLogin, setCurrentUserLogin] = useState(null);

  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      if (localStorage.getItem('loginType') === 'employee') {
        setCurrentUserLogin(newShape);
      } else if (localStorage.getItem('loginType') === 'user') {
        setCurrentUserLogin(newShape);
      };
    };
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

  const handleChangeUpdatingData = () => {
    if (updatingData === 'profile') {
      setUpdatingData('password');
    } else if (updatingData === 'password') {
      setUpdatingData('profile');
    };
  };

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
          <div className='dashboard__handler d-flex signUpForm__mainSec'>
            <MyNewSidebarDash token={token} />
            <div className='main__content container signUpForm__mainContent'>
              <MainContentHeader currentUserLogin={currentUserLogin} />
              <ul onClick={handleChangeUpdatingData} className="updatingToggler">
                <li>
                  {
                    updatingData === 'profile' ? 'Update Password' : 'Update Profile'
                  }
                  <i className="bi bi-arrow-right-short"></i>
                </li>
              </ul>
              <div className='col-12 my-3'>
                {
                  updatingData === 'profile' ?
                    <CompanyDashboardProfileForm
                      setProfileUpdateStatus={setProfileUpdateStatus}
                      currentUserLogin={currentUserLogin}
                      setCurrentUserLogin={setCurrentUserLogin}
                      profileUpdateStatus={profileUpdateStatus}
                      countries={countries}
                      token={token}
                    />
                    :
                    <UpdatePassword
                      token={token}
                      setUpdatingData={setUpdatingData}
                    />
                }
              </div>
            </div>
          </div>
      }
    </>
  );
};
