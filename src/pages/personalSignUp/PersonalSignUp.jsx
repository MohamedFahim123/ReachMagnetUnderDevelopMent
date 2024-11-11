import React, { useEffect, useState } from 'react';
import './regester.css';
import PersonalSignUpFormMainSec from '../../components/personalSignUpFormMainSec/PersonalSignUpFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function PersonalSignUp({ countries, industries}) {
  const [loading, setLoading] = useState(true);

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
          <div className='signUp__page'>
            <PersonalSignUpFormMainSec
              countries={countries}
              industries={industries}
              isSignUp={true}
            />
          </div>
      }
    </>
  );
};
