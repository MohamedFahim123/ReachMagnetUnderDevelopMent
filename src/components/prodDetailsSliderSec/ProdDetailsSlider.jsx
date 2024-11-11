import React, { useEffect, useState } from 'react';
import './prodDetailsSlider.css';
import { Col, Container, Row } from 'react-bootstrap';


import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';


export default function ProdDetailsSlider({productImgs}) {
  const [currImg,setCurrImg] = useState('');
  const [currImages,setCurrentImages] = useState([]);
  useEffect(()=>{
      if(productImgs){
        setCurrImg(productImgs[0]?.image ? productImgs[0]?.image : productImgs[0]?.media);
        setCurrentImages(productImgs.slice(0,5))
      };
  },[productImgs]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Container>
      <Row>
        <Col md={2}>
          <div className="d-flex flex-column justify-content-between sideImagesContainer">
            {
              currImages?.map(img =>{
                return(
                  <div key={img?.id} className="imgContainer">
                    <img onClick={()=>{
                      setCurrImg(img?.image ? img?.image : img?.media);
                    }}
                    src={img?.image ? img?.image : img?.media} 
                    alt='product detials' 
                    />
                  </div>
                )
              })
            }
          </div>
        </Col>
        <Col md={10} className='activeImage'>
          <div className="imgContainer">
            <img src={currImg} alt="product Details" />
          </div>
        </Col>
        <Col lg={12} className='sliderOfProductDetails'>
        <Swiper
        style={{
          '--swiper-navigation-color': '#969696',
          '--swiper-pagination-color': '#969696',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {
          currImages?.map(img=>{
            return(
              <SwiperSlide key={img?.id}>
                <img className='activeImgInSlider' src={img?.image} alt='product details'/>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        slidesPerView={1}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mb-4"
        breakpoints={{
        200: {
          slidesPerView: 2,
        },
        400:{
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 5,
          },
        }}
      >
        {
          currImages?.map(img=>{
            return(
              <SwiperSlide key={img?.id}>
                <img className='swiperSlideSecondaryImg' src={img?.image} alt='product details'/>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
        </Col>
      </Row>
    </Container>
  )
}
