import React from 'react'
import './aboutReachSec.css'
import frame from '../../assets/aboutReach/Frame 1321315457.png'
export default function AboutReachSec() {
    const numbersInfo = [
        {
            number: '0',
            title: 'Companies'
        },
        {
            number: '0',
            title: 'Users'
        },
        {
            number: '0',
            title: 'Products'
        },
    ]
    return (
        <div className='aboutReachSec__handler'>
            <div className="container">
                <div className="row ">
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="about__info">
                            <h1 className='info__title'>
                                About <span className='text__blue'>Reach</span>Magnet
                            </h1>
                            <div className="aboutReach__numbers d-flex ">
                                {
                                    numbersInfo.map((el, index) => {
                                        return (
                                            <div key={index} className="box__number">
                                                <h1>
                                                    {el.number}
                                                </h1>
                                                <p>
                                                    {el.title}
                                                </p>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-sm-12 ">
                        <div className="aboutReach__video">
                            <img src={frame} alt="frame-video" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
