import React, { useEffect, useState } from 'react';
import './discover.css';
import MyMainHeroSec from '../../components/myMainHeroSecc/MyMainHeroSec';
import FranchiseSec from '../../components/franchiseSecc/FranchiseSec';
import ShopCategorySlider from '../../components/shopCategorySliderSec/ShopCategorySlider';
import ShopSliderSec from '../../components/myShopSliderSec/ShopSliderSec';
import HeaderOfSec from '../../components/myHeaderOfSec/HeaderOfSec';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function Discover() {
  const [loading,setLoading] = useState(true);
  const arrOfCateg = [
    {
      name: 'Categories',
      id: 1
    },
    {
      name: 'One',
      id: 2
    },
    {
      name: 'Two',
      id: 3
    },
    {
      name: "Three",
      id: 4
    }
  ];

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },500);
  },[loading]);

  return (
    <>
    {
        loading ? 
        <MyLoader />
      :
      <>
      <MyMainHeroSec 
      heroSecContainerType='shopHeroSec__container' 
      headText='Ready To Buy Products' 
      paraPartOne='Dive into thousands of products ready to buy today'
      paraPartTwo='in your region, from a needle to whatever you need'
      categoryArr={arrOfCateg}
      />
      <ShopCategorySlider />
      <HeaderOfSec
        secHead='Trending Products'
        secText='There are many variations of passages of Lorem Ipsum available but the majority have suffered'
      />
      <ShopSliderSec />

      <FranchiseSec
        pageName='discover'
        headText='New Arrivals'
        paraText='Check Our New Collection'
      />
      <ShopSliderSec 
      />
      </>
    }
    </>
  );
};
