import React from 'react'
import './borderedNavigationbar.css'
export default function BorderedNavigationBar({listTitle, itemStyle}) {
  return (
    <li className={`borderdNavigateItem ${itemStyle}`}>{listTitle}</li>
  )
}
