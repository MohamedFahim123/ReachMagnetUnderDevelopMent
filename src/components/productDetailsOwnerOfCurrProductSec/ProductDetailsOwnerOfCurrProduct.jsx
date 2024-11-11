import React from 'react';
import './productDetailsOwnerOfCurrProduct.css';
import { Col, Container, Row } from 'react-bootstrap';

export default function ProductDetailsOwnerOfCurrProduct({companyName}) {
  return (
    <Container className='mt-5 mb-3 pb-0'>
      <Row>
        <Col lg={12}>
          <h2 className='productOwnerName'>
            More from {companyName ? companyName : ''}
          </h2>
        </Col>
      </Row>
    </Container>
  );
};
