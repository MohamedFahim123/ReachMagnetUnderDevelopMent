import React, { useEffect, useState } from 'react';
import SignUpHead from '../../components/signUpHeadSec/SignUpHead'
import ForgetPasswordForm from '../../components/forgetPasswordFormMainSec/ForgetPasswordForm'
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function EnterUrEmail() {
  const [loading, setLoading] = useState(true);
  const loginType = localStorage.getItem('loginType');

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
          <>
            {
              loginType === 'user'
              &&
              <div className='signUp__page replace__margin__with__padding'>
                <SignUpHead />
                <ForgetPasswordForm />
              </div>
            }
          </>
      }
    </>
  )
}
