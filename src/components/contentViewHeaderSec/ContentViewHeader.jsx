import React from 'react'
import './contentViewHeader.css'
export default function ContentViewHeader({title}) {
  return (
    <div className="content__view__header d-flex justify-content-between align-items-center">
        <h1>
          {title}
        </h1>
      </div>
  )
}
