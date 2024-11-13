import React, { useEffect, useState } from 'react'
import BusinessSignUpFormMainSec from '../../components/businessSignUpFormMainSec/BusinessSignUpFormMainSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllIndustriesStore } from '../../store/AllIndustries';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';
import { GetAllMainActivitiesStore } from '../../store/AllMainActivities';
import { GetAllCitizenshipsStore } from '../../store/AllCitizenships';

export default function BusinessSignUp() {
  const [loading, setLoading] = useState(true);
  const countries = GetAllCountriesStore((state) => state.countries);
  const industries = GetAllIndustriesStore((state) => state.industries);
  const mainCategories = GetAllMainCategoriesStore((state) => state.mainCategories);
  const mainActivities = GetAllMainActivitiesStore((state) => state.mainActivities);
  const citizenships = GetAllCitizenshipsStore((state) => state.citizenships);

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
