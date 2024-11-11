import React from 'react';
import './shopMainCard.css';
import { useNavigate } from 'react-router-dom';

export default function ShopMainCard({link,imgSrc,cardHead,cardText,rate,buttonText,rateSpan}) {
  const navigate = useNavigate();

  return (
    <div className='shopMain__card d-flex flex-column justify-content-around align-items-center'>
      <div className='shopMain__card-image text-center'>
        <img onClick={()=> navigate(`${link}`)} src={imgSrc ? imgSrc : ''} alt="" />
      </div>
      <div className='shopMain__card-body'>
        <h4 onClick={()=> navigate(`${link}`)} className='px-2'>
          {
            cardHead ? cardHead : ''
          }
        </h4>
        <p className='px-2'>
          {
            cardText ? cardText : ''
          }
          $
        </p>
        <div className='shopMain__card-body_bottom d-flex justify-content-between'>
          <div className='shopMain__card-body_rate-holder d-flex justify-content-between me-3'>
            <i className="bi bi-star-fill"></i>
            <p>
              {
                rate ? rate : ''
              }
              <span>
                {rateSpan ? rateSpan : ''}
              </span>
            </p>
          </div>
          <div className='shopMain__card-body_button-holder'>
            <button className='pageMainBtnStyle'>
              {
                buttonText ? buttonText : ''
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
