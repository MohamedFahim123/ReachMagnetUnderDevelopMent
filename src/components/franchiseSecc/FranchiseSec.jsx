import React from 'react';
import './franchiseSec.css';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';

export default function FranchiseSec({ pageName, headText, paraText, btnOneText, btnTwoText, btnOnelink }) {
    return (
        <div className={`franchiseSec__handler`}>
            <div className="container">
                <div className={`${pageName === 'home' ? 'franchiseSec__content' : 'franchiseSec__content franchiseSec__content-two overlay20'} text-center`}>
                    <h3>
                        {headText ? headText : ''}
                    </h3>
                    <p>
                        {paraText ? paraText : ''}
                    </p>
                    <div className="franchise__actions">
                        {
                            btnOneText ?
                                <NavLink  
                                onClick={() => {
                                    scrollToTop();
                                }} 
                                to={btnOnelink} className='nav-link'>
                                    <button>
                                        {btnOneText}
                                    </button>
                                </NavLink>
                                :
                                ''
                        }
                        {
                            btnTwoText ?
                                <button>
                                    {btnTwoText}
                                </button>
                                :
                                ''
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
