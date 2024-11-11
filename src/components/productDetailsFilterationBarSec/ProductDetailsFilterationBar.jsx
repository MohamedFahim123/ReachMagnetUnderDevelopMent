import React from 'react';
import './productDetailsFilterationBar.css';

export default function ProductDetailsFilterationBar({items, onItemClick}) {

  return (
    <div className='productDetailsFilterationBar'>
    <div className="container">
      <div className="row">
        <div className="col-12">
          <ul className='productDetailsFilterationBar-list d-flex flex-wrap justify-content-start align-items-center'>
            {items.map((item, index) => (
              <li key={index}  onClick={() => onItemClick(item.name)} className={item.active ? 'active' : ''}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
  )
}
