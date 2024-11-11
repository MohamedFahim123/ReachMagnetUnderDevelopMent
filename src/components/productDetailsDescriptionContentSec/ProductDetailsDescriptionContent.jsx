import React from 'react';
import './productDetailsDescriptionContent.css';
import { Col, Container, Row } from 'react-bootstrap';

export default function ProductDetailsDescriptionContent({ product }) {
  return (
    <Container>
      <Row>
        <Col lg={12}>
          <div className='productDetails__content mb-5'>
            <h4 className='productDetails__contentHead mt-4 fs-3 fw-bold text-capitalize'>
              Description
            </h4>
            <p className='mt-3 mb-4 fs-5'>
              {product?.description}
            </p>
            <p className='fw-bold fs-2'>{product?.productAttribute === 'N/A' ? '' : product?.productAttribute}
            </p>
            <div className="row prodDetailsChangeColorSpan">
              {
                product?.productAttributeValues?.map(prod => (
                  <div className="col-lg-12" key={prod?.id}>
                    <p className='fw-bold fs-5'>
                      value:
                      <span className='fw-medium fs-6'> {prod?.value ? prod?.value : ''}</span>
                    </p>
                  </div>
                ))
              }
            </div>
            {
              product?.limited_date ?
                <>
                  <div className="row prodDetailsChangeColorSpan">
                    <div className="col-lg-6 mb-3">
                      <p className='fw-medium text-capitalize fs-4'>
                        total price:
                        <span className='fw-medium ms-2 fs-5'>
                          {product?.total_price} {product?.currency_symbol}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <p className='fw-medium text-capitalize fs-4'>
                        quantity: 
                        <span className='fw-medium ms-2 fs-5'>
                          {product?.quantity} Pieces
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <p className='fw-medium text-capitalize fs-4'>
                        price per item: 
                        <span className='fw-medium ms-2 fs-5'>
                          {product?.price_per_item} {product?.currency_symbol}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-6 mb-3">
                      <p className='fw-medium text-capitalize fs-4'>
                        secure for reservation: 
                        <span className='fw-medium ms-2 fs-5'>
                          {product?.secure} {product?.currency_symbol}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-12 mb-3">
                      <p className='fw-medium text-capitalize fs-4'>
                        limited date: 
                        <span className='fw-medium limitedP ms-2 fs-5'>
                          {product?.limited_date}
                        </span>
                      </p>
                    </div>
                  </div>
                </>
                :
                ''
            }
          </div>
        </Col>
        {/* <Col lg={12}>
          <div className="frequentlyTogether">
              <h4>
                Frequently Bought Together
              </h4>
              <div className="frequentlyTogether-offer mt-4 d-flex justify-content-between align-items-center flex-wrap">
                <div className="frequentlyTogether-image position-relative">
                  <img src={img1} alt="" />
                  <i className="bi bi-check-square-fill"></i>
                  <h5>
                    White wood chair
                  </h5>
                </div>
                <i className="bi bi-plus"></i>
                <div className="frequentlyTogether-image position-relative">
                  <img src={img2} alt="" />
                  <i className="bi bi-check-square-fill"></i>
                  <h5>
                    Wood side table
                  </h5>
                </div>
                <div>
                  <button className='buyTogether-btn'>
                    Buy 2 Together for 250 AED
                  </button>
                </div>
              </div>
            </div>
        </Col> */}
      </Row>
    </Container>
  );
};
