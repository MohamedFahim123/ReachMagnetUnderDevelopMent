import React from 'react';
import './headerOfSec.css';

export default function HeaderOfSec({secHead,secText}) {
  return (
    <div className='header_ofSec py-4 text-center'>
      <h3 className='mb-4'>
        {secHead ? secHead : ''}
      </h3>
      <p>
        {secText ? secText : ''}
      </p>
    </div>
  )
}
