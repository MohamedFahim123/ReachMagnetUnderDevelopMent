import React from 'react'
import './heroOnlyCover.css'
export default function HeroOnlyCover({companyCover}) {  
  return (
    <div style={{backgroundImage:`url(${companyCover})`}} className='heroOnlyCover__handler'>
    </div>
  )
}
