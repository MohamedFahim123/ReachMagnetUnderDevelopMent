import React, { useEffect, useState } from 'react';
import './home.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import AllCategorySec from '../../components/allCategorySecc/AllCategorySec';
import FranchiseSec from '../../components/franchiseSecc/FranchiseSec';
import TrendingCompanySec from '../../components/trendingCompanySecc/TrendingCompanySec';
import GrowBuisnessSec from '../../components/growBuisnessSecc/GrowBuisnessSec';
import SingleCompanyNewsSec from '../../components/singleCompanyNewsSec/SingleCompanyNewsSec';
import HeaderOfSec from '../../components/myHeaderOfSec/HeaderOfSec';
import DownloadApp from '../../components/downloadAppSec/DownloadApp';
import MyLoader from '../../components/myLoaderSec/MyLoader';


export default function Home({ companies, token, countries, selectedIndustries, fetchCartItems, wishlistItems }) {

  const [loading, setLoading] = useState(true);
  const arrOfCateg = [
    {
      name: 'Companies',
      id: 1
    },
  ];

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
          <div className='myHomeSec__handler'>
            <MyMainHeroSec
              heroSecContainerType='heroSec__container'
              headText='Search for your next opportunity'
              paraPartOne='Unlock full potential by finding exactly what you need'
              categoryArr={arrOfCateg}
              countries={countries}
            />
            
            {/* <AboutReachSec /> */}
            <div className='mt-5'>
              <AllCategorySec selectedIndustries={selectedIndustries}/>
            </div>
            
            <div className='mt-5'>
              <TrendingCompanySec companies={companies} token={token} />
            </div>
            {
              <div className='oneClickQuotation__handler'>
                <FranchiseSec
                  pageName='discover'
                  headText='One-click Quotation'
                  paraText='Submit your request with ReachMagnets one-click tool and receive multiple quotations from companies, allowing you to compare and choose the best offer'
                  btnOneText='Start Now'
                  btnOnelink='/one-click-quotation'
                />
              </div>
            }
            {/* <ReadyToByProductsHome fetchCartItems={fetchCartItems} wishlistItems={wishlistItems} token={token} secMAinTitle={`Ready-To-Buy Products`}/> */}
            
            <GrowBuisnessSec />
            {/* <LastMinuteDeals setLoading={setLoading} token={token}/> */}
            <div className='mt-3'>
              <HeaderOfSec
                secHead='Companies Insights'
                secText='Stay informed with the latest updates, announcements, and specials from top companies'
              />
              <SingleCompanyNewsSec setLoading={setLoading} token={token} />
            </div>
            <DownloadApp />
          </div>
      }
    </>
  )
}
