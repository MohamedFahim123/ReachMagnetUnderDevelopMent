import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/autoplay";
import Autoplay from "../../../node_modules/swiper/modules/autoplay.mjs";
import { Col, Container, Row } from 'react-bootstrap';
import "./singleCompanyNews.css";
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec';

export default function SingleCompanyNewsSec({ token, companyId }) {
  const [newData, setNewdata] = useState([])
  const fetchCompanyPosts = async () => {
    try {
      if (companyId) {
          const response = await axios.get(`${baseURL}/company-posts/${companyId}?t=${new Date().getTime()}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setNewdata(response?.data?.data?.posts);
      }
      
    } catch (error) {
      // toast.error(error?.response?.data?.message);
    };
  };

  useEffect(() => {
    fetchCompanyPosts();
  }, []);

  return (
    <>
      {
        newData.length > 0 && (
          <>
            <HeaderOfSec
              secHead='Companies Insights'
              secText='Stay informed with the latest updates, announcements, and specials from our company'
            />
            <Container className='my-5'>
              <Row className='justify-content-center'>

                <Col lg={12} md={12} className=''>
                  <Swiper
                    className='mySwiper'
                    modules={[Autoplay]}
                    autoplay={{
                      delay: 2500,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: false
                    }}
                    breakpoints={{
                      300: {
                        slidesPerView: 1.1,
                        spaceBetween: 10
                      },
                      426: {
                        slidesPerView: 1.2,
                        spaceBetween: 20
                      },
                      600: {
                        slidesPerView: 2.2,
                        spaceBetween: 15
                      },
                      768: {
                        slidesPerView: 2.2,
                        spaceBetween: 15
                      },
                      995: {
                        slidesPerView: 3,
                        spaceBetween: 20
                      },
                    }}
                  >
                    {
                      newData?.map(el => {
                        return (
                          <SwiperSlide key={el?.postId} className=''>
                            <div className="news__card p-3">
                              <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                <div className="headOfNews__card-leftPart">
                                  <div className="image">
                                    <NavLink
                                      onClick={() => {
                                        scrollToTop();
                                      }}
                                      className={'nav-link'} to={`/show-company/${el?.companySlug}`}>
                                      <img src={el?.companyLogo} alt="newImg" />
                                    </NavLink>
                                  </div>
                                  <h4>{el?.postTitle}</h4>
                                  <p>Type: {el?.postType}</p>
                                  <p>{el?.postDate}</p>
                                </div>
                              </div>
                              <div className="news__card-body">
                                <p>
                                  {
                                    el?.postDescription
                                  }
                                </p>
                              </div>
                            </div>

                          </SwiperSlide>
                        )
                      })
                    }
                  </Swiper>
                  <div className="showAllBtn d-flex justify-content-end align-items-center">
                    <NavLink className={'nav-link'} to={'/all-insights'}>
                      All Insights
                      <i className="bi bi-arrow-bar-right"></i>
                    </NavLink>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
      )}
    </>
  )
}
