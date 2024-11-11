import React, { useEffect, useState } from 'react';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UserVirificationFormSec from '../../components/userVirificationForm/UserVirificationFormSec';

export default function UserVirificationSec({token}) {
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
          <UserVirificationFormSec token={token} />
      }
    </>
  );
}
