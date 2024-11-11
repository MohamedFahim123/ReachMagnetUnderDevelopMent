import React from 'react'
import './allCategorySec.css'
import HeaderSec from '../myHeaderSec/HeaderSec'
import other from '../../assets/categoryIcons/other.png'
import CategoryOctagonShape from '../categoryOctagonShapeSec/CategoryOctagonShape'

export default function AllCategorySec({selectedIndustries}) {
    return (
        <div className='allCategorySec__handler mb-5'>
            <div className="container">
                <div className="allCategory__header text-center">
                    <HeaderSec title={'Browse By Industry'}
                    />
                </div>
                <div className="allCategory__items mt-5">
                    <div className="category__octagon__flex__box">
                        {
                        selectedIndustries?.map((el, index) => {
                            return (
                            <div key={index}>
                                <CategoryOctagonShape 
                                octagonIcon={el?.icon} 
                                iconName={el?.name} 
                                iconLink={`/all-Industries/${el?.id}`}
                                />
                            </div>
                            )})
                        }
                        <div>
                            <CategoryOctagonShape 
                                octagonIcon={other} 
                                iconName={'other'} 
                                iconLink={'/all-Industries'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
