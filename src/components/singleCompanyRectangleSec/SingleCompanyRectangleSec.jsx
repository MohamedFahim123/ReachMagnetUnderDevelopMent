import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import './singleCompanyRectangle.css';

export default function SingleCompanyRectangleSec({showCompaniesQuery}) {
  return (
    <div className='singleCompany__rectangleSec'>
      <div className="rectangleBg"></div>
      <div className="container">
        <div className="singleCompany__rectangleSec-head text-center">
          <h3 className='text-capitalize'>
            {showCompaniesQuery?.companyName} Popular <span>Questions</span>
          </h3>
          <p>
          Find the answers you need before you even ask
          </p>
        </div>
        <div className="singleCompany__rectangleSec-slider">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            breakpoints={{
              470: {
                slidesPerView: 2,
                spaceBetween: 10
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10
              }
            }}
            className="mySwiper"
          >
            {
              showCompaniesQuery?.companyFaqs?.map((question,idx)=>{
                return(
                  <SwiperSlide key={idx} className='singleCompany__rectangleSec-slide'>
                    <h4>{question?.question}</h4>
                    <p>{question?.answer}</p>
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
        </div>
      </div>
    </div>
  );
};
