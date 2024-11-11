import React from 'react';
import './shopCategorySlider.css';
import furnitre from '../../assets/categoryIcons/furniture.png'
import kitchen from '../../assets/categoryIcons/kitchen.png'
import sport from '../../assets/categoryIcons/sports.png'
import lighting from '../../assets/categoryIcons/lighting.png'
import img1 from '../../assets/productCategoryImages/6d1dc54671310022627aa35cd7ae6ca2.png'
import img2 from '../../assets/productCategoryImages/7625995dbfd5706f3e7e58506140b813.png'
import img3 from '../../assets/productCategoryImages/a80f45ca83acb10b6b21f0a59a377c11.png'
import img4 from '../../assets/productCategoryImages/b279e8b83414ebef6e8381776f17d75e.png'
import img5 from '../../assets/productCategoryImages/cbb2041123cdca224b278970085ac968.png'
import img6 from '../../assets/productCategoryImages/de47d6ebd7226953572ed42e9823c159.png'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import CategoryOctagonShape from '../categoryOctagonShapeSec/CategoryOctagonShape';
import { Container } from 'react-bootstrap';

export default function ShopCategorySlider() {
  const categoryItems = [
    {
        img: furnitre,
        title: 'furnitre',
        link: '/Shop',
        id: 1
    },
    {
        img: kitchen,
        title: 'kitchen',
        link: '/Shop',
        id: 2
    },
    {
        img: sport,
        title: 'sports',
        link: '/Shop',
        id: 3
    },
    {
        img: lighting,
        title: 'lighting',
        link: '/Shop',
        id: 4
    },
    {
        img: img1,
        title: 'decoration',
        link: '/Shop',
        id: 5
    },
    {
        img: img2,
        title: 'kids',
        link: '/Shop',
        id: 6
    },
    {
        img: img3,
        title: 'make-up',
        link: '/Shop',
        id: 7
    },
    {
        img: img4,
        title: 'health',
        link: '/Shop',
        id: 8
    },
    {
        img: img5,
        title: 'pets',
        link: '/Shop',
        id: 9
    },
    {
        img: img6,
        title: 'other',
        link: '/Shop',
        id: 10
    },
  ]

  return (
    <div className='shopCategory__SliderSec py-5 my-5'>
      <Container>
        <Swiper
          className='mySwiper'
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
          }}
          // loop
          breakpoints={{
            300: {
              slidesPerView: 5,
              spaceBetween: 10
            },
            426: {
              slidesPerView: 4.1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 5.1,
              spaceBetween: 30
            },
            995: {
              slidesPerView: 6,
              spaceBetween: 30
            },
          }}
        >
          {categoryItems.map(el=>{
            return(
              <SwiperSlide key={el.id}>
                <CategoryOctagonShape
                octagonIcon={el.img} 
                iconName={el.title} 
                iconLink={el.link}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </Container>
    </div>
  );
};
