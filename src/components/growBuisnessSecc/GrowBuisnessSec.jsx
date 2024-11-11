import React from 'react'
import './growBuisnessSec.css'
import { NavLink } from 'react-router-dom'
import { scrollToTop } from '../../functions/scrollToTop';
export default function GrowBuisnessSec() {
    return (
        <div className='growBuisness__handler'>
            <div className="container">
                <div className="growBuisness__content">
                    <div className="growBuisness__header">
                        <h1>
                            grow your <span>business</span>
                        </h1>
                        <p>
                            More Than 5000 Partner
                        </p>
                    </div>
                    <div className="gowBuisness__action">
                        <NavLink className={'nav-link'} to={'/business-signUp'}
                            onClick={() => {
                                scrollToTop();
                            }}>
                            <button className='linear__btn'>
                                Be a Partner
                            </button>
                        </NavLink>

                    </div>
                </div>
            </div>
        </div>
    )
}
