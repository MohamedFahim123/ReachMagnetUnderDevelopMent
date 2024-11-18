import React from 'react'
import './lastMinuteCard.css'
import timeImg from '../../assets/lastMinuteCardImgs/mdi_timer-sand.png'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
export default function LastMinuteCard({
    productImage,
    productName,
    dealTimeDay,
    // dealTotPrice,
    productLink,
    // dealQuantity,
    showCustomContent,
    buttonLabel = 'Know more',
    onKnowMoreClick,
    onAddClick,
    borderColor = 'rgba(148, 21, 21, 1)'
}) {
    const handleButtonClick = () => {
        if (buttonLabel === 'Know more' && onKnowMoreClick) {
            onKnowMoreClick();
        } else if (buttonLabel === 'Add' && onAddClick) {
            onAddClick();
        };
    };


    const cardStyles = {
        background: 'var(--primary-white)',
        padding: '10px',
        borderRadius: '20px',
        border: `2px solid ${borderColor}`
    };
    const buttonClass = buttonLabel === 'Added' ? 'addedButtonStyle' : 'addButtonStyle';

    return (
        <>
            <div className='lastMinuteCard__handler' style={cardStyles} >
                <div className="product__image">
                    <img src={productImage} alt="product-imag" />
                </div>
                <div className="product__info">
                    <div className="main__info">
                        <NavLink target="_blank" className={'nav-link'} to={productLink ? productLink : ''} onClick={() => {
                            scrollToTop();
                        }}>
                            <h3 className='text-capitalize' title={productName}> {productName.length > 14 ? `${productName.slice(0, 14)}...` : productName}</h3>

                        </NavLink>
                        {showCustomContent ? (
                            <p>Price on Request</p>
                        ) : (
                            <div className="deal__time">
                                <img src={timeImg} alt="time" />
                                <div className="deal__time__day">
                                    <p>Limit Date</p>
                                    <p>{dealTimeDay}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="sub__info">
                        {/* <p>{dealQuantity}</p> */}
                        <NavLink target="_blank" to={productLink ? productLink : ''} className="pageMainBtnStyle terquase mb-2">More Info <i class="bi bi-box-arrow-up-right"></i>
                        </NavLink>
                        <span className={`pageMainBtnStyle d-flex justify-content-center ${buttonClass}`} onClick={handleButtonClick}>
                            {buttonLabel}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}
