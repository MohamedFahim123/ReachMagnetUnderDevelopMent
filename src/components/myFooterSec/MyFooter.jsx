import React from 'react';
import './myFooter.css';

export default function MyFooter() {
  const listFooterData = [
    // {
    //   title: "Resources",
    //   items: ["Download", "Help centre", "Guide Book", "App Directory"]
    // },
    // {
    //   title: "Travellers",
    //   items: ["Why Travellers", "Enterprice", "Customer Stories", "Instgram post"]
    // },
    // {
    //   title: "Company",
    //   items: ["Travelling", "About Locato", "Success", "Information"]
    // },
    {
      title: "Pages",
      items: ["About Us", "Privacy Policy", "Terms & Conditions"]
    },
  ];
  return (
    <div className='myFooterSec__handler'>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-6 col-md-6 col-sm-12 adjustFlexDir">
            <div className="footer__desc">
              <p>
              ReachMagnet is a cutting-edge platform designed to redefine interactions between businesses and individuals in the digital age.
              </p>
            </div>
            <ul className='footer__icons'>
              <li>
                <i className="bi bi-facebook"></i>
              </li>
              <li>
                <i className="bi bi-twitter-x"></i>
              </li>
              <li>
                <i className="bi bi-instagram"></i>
              </li>
              <li>
                <i className="bi bi-linkedin"></i>
              </li>
              <li>
                <i className="bi bi-tiktok"></i>
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            {/* <div className='adjustflexWrao'>
              {
                listFooterData.map((list, index) => {
                  return (
                    <>
                      <div className="footer__listBox">
                        <div className="footer__listBox__tit">
                          <h5>
                            {list.title}
                          </h5>
                          <ul>
                            {
                              list?.items?.map((item, idx) => {
                                return (
                                  <li key={idx} className='footer__listBox__items'>
                                    {item}
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                      </div>
                    </>
                  )
                })
              }
            </div> */}
            <div className="row justify-content-end">
              {
                listFooterData.map((list, index) => {
                  return (
                    <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                      <div className="footer__listBox">
                        <div className="footer__listBox__tit">
                          <h5>
                            {list.title}
                          </h5>
                          <ul>
                            {
                              list?.items?.map((item, idx) => {
                                return (
                                  <li key={idx} className='footer__listBox__items'>
                                    {item}
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
