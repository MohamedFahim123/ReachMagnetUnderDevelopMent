import React from 'react';
import './singleCompanyAffiliate.css';
import { Col, Container, Row } from 'react-bootstrap';
import HeaderOfSec from '../myHeaderOfSec/HeaderOfSec';

export default function SingleCompanyAffiliate() {
  return (
    <div className='singleCompany__affiliate mb-5'>

      <Container>
        <Row>
          <div className="col-12">
            <div className="affiliate-innerContent">
              <HeaderOfSec 
              secHead='ProjectX is an official affiliate'
              secText='now you can hire ReachMagnet to negotiate on your behalf, inspect the goods, and much more'
              />
              <div className="row justify-content-around flex-wrap">
                <Col lg={2} md={12}  className='leftAffiliate'>
                  <div className="star">
                  </div>
                  <h4>
                    Affiliate
                  </h4>
                </Col>
                <Col lg={4} md={5} className="affiliate-card">
                  <div className='affiliate-card-top'>
                    <h5>
                      Can ReachMagnet take care from A-Z ?
                    </h5>
                  </div>
                  <div className='affiliate-card-bottom'>
                    <p>
                      Yes of course, we can take care of the whole process, negotiate the best deal possible, inspect the products, and follow-up until it reaches the desired destination
                    </p>
                  </div>
                </Col>
                <Col lg={4} md={5} className="affiliate-card">
                  <div className='affiliate-card-top'>
                    <h5>
                      Does ReachMagnet charge for this?
                    </h5>
                  </div>
                  <div className='affiliate-card-bottom'>
                    <p>
                    We charge a fair amount which we guarantee it will be way better than you dealing with all the deals’ aspects
                    </p>
                  </div>
                </Col>
                <Col lg={12} className='mt-5'>
                  <button className='affiliateBtn'>
                    Start Now
                  </button>
                </Col>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  )
}
