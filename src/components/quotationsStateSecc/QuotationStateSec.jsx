import React from 'react'
import icon1 from '../../assets/quotationsIcons/profile-2user.png'
import icon2 from '../../assets/quotationsIcons/profile-tick.png'
import icon3 from '../../assets/quotationsIcons/monitor.png'
import arrowUp from '../../assets/quotationsIcons/arrow-up 1.svg'
import arrowDown from '../../assets/quotationsIcons/arrow-down.svg'
import './quotationStateSec.css'
export default function QuotationStateSec() {
    const quotationsItems = [
        {
            icon: icon1,
            title: 'Customers',
            num: '5,423',
            span: '16%',
            disc: 'this month',
            style: 'ups',
            arrow: arrowUp
        },
        {
            icon: icon2,
            title: 'Folllowers',
            num: '1,893',
            span: '1%',
            disc: 'this month',
            style: 'downs',
            arrow: arrowDown
        },
        {
            icon: icon3,
            title: 'Contacts',
            num: '189',
            span: '4%',
            disc: 'this month',
            style: 'downs',
            arrow: arrowDown
        },
    ]
    return (
        <div className='quotationState__handler content__view__handler'>
            <div className="row justify-content-center">
                {
                    quotationsItems.map((el, index) => {
                        return (
                            <div key={index} className="col-lg-4 col-md-4">
                                <div className="quotationState__list__item">
                                    <div className="quotationIcon">
                                        <img src={el.icon} alt={el.title} />
                                    </div>
                                    <div className="quotationInfo">
                                        <p className='quotation__title'>
                                            {el.title}
                                        </p>
                                        <h1>
                                            {el.num}
                                        </h1>
                                        <p className='quotation__disc'>
                                            <span className='span__img'>
                                                <img src={el.arrow} alt="arrow" />
                                            </span> <span className={`span__num ${el.style}`}>{el.span}</span> {el.disc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
