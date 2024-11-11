import React, { useEffect, useState } from 'react'
import BusinessSignUpFormMainSec from '../../components/businessSignUpFormMainSec/BusinessSignUpFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function BusinessSignUp({ citizenships , countries, industries, mainCategories, mainActivities }) {
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
            <BusinessSignUpFormMainSec
              citizenships={citizenships}
              countries={countries}
              industries={industries}
              mainCategories={mainCategories}
              mainActivities={mainActivities}
            />
          </div>
      }
    </>
  );
};
