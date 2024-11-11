import React from 'react'
import './headerSec.css'
export default function HeaderSec({title, desc}) {
  return (
    <div className='headerSec__handler'>
        <h1>
            {title}
        </h1>
        <p>
            {desc}
        </p>
    </div>
  )
}
