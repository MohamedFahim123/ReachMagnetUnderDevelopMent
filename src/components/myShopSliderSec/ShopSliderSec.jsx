import React from 'react';
import './shopSliderSec.css';
import { Container} from 'react-bootstrap';
import img1 from '../../assets/furnitureImages/0628742713786f4ad2af80b4b11e6013.png';
import img2 from '../../assets/furnitureImages/0fba54bf2fab0de3aebec1f831b4e867.png';
import img3 from '../../assets/furnitureImages/1cb0834b647faa64987a63dc0a27c102.png';
import img4 from '../../assets/furnitureImages/2b45dffd5372a0e5f5f6b18aa42fd497.png';
import img5 from '../../assets/furnitureImages/37bd3862f7a29151f3a62320207e6577.png';
import img6 from '../../assets/furnitureImages/41f507623c0fbfa0ca57c4ae2de7b7a9.png';
import img7 from '../../assets/furnitureImages/603bfbf76e8dd823e209267443dee68f.png';
import img8 from '../../assets/furnitureImages/64394439a1020ac1f32bac6bf45b0268.png';
import img9 from '../../assets/furnitureImages/7bbba7a5b45aef5c093d5b52b7fdaaf3.png';
import img10 from '../../assets/furnitureImages/7f3d3ab0efc74fa7ed863893dcabab51.png';
import img11 from '../../assets/furnitureImages/bb83cdfcdd7b0006473a2d9fe09476f0.png';
import img12 from '../../assets/furnitureImages/cbb2041123cdca224b278970085ac968.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import ShopMainCard from '../shopMainCardSec/ShopMainCard';

export default function ShopSliderSec() {
  const items = [
    {
      img: img1,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 1
    },
    {
      img: img2,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 2
    },
    {
      img: img3,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 3
    },
    {
      img: img4,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 4
    },
    {
      img: img5,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 5
    },
    {
      img: img6,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 6
    },
    {
      img: img7,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 7
    },
    {
      img: img8,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 8
    },
    {
      img: img9,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 9
    },
    {
      img: img10,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 10
    },
    {
      img: img11,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 11
    },
    {
      img: img12,
      title: 'Blue Classic Chair',
      pricd: 65,
      rate: 4.6,
      span: '(850)',
      link: '/Shop/:prodDetails',
      id: 12
    }
  ]

  return (
    <Container className='mt-3 mb-5 pb-4'>
        <Swiper
          className='mySwiper py-4'
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
          }}
          // loop
          breakpoints={{
            375: {
              slidesPerView: 2.06,
              spaceBetween: 20
            },
            767: {
              slidesPerView: 3.03,
              spaceBetween: 20
            },
            900: {
              slidesPerView: 4.1,
              spaceBetween: 20
            },
            1000: {
              slidesPerView: 5,
              spaceBetween: 30
            },
            1150: {
              slidesPerView: 6,
              spaceBetween: 30
            },
          }}
        >
          {
            items.map(item=>{
              return(
                <SwiperSlide key={item.id}>
                <ShopMainCard
                  imgSrc={item.img}
                  cardHead={item.title}
                  cardText={item.pricd}
                  rate={item.rate}
                  rateSpan={item.span}
                  link={item.link}
                  buttonText='Buy Now'
                />
              </SwiperSlide>
              )
            })
          }
        </Swiper>
      
    </Container>
  );
};
