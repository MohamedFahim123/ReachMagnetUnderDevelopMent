import React from 'react'

export default function MainSearchBar({heroSecContainerType, categoryArr}) {
    return (
        <div className="row container justify-content-center">
            <div className="col-lg-10 col-md-10 col-sm-10 none__on__small__screen">
                <div className="hero__form__bar d-flex justify-content-center">

                    {
                        heroSecContainerType === 'heroSec__container' ?
                            <>
                                {
                                    categoryArr ?
                                        <div className="form__part select__category__part">
                                            <select name="" id="">
                                                {
                                                    categoryArr.map(el => {
                                                        return (
                                                            <option key={el.id} value={el.id}>{el.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        :
                                        ''
                                }
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search for Services, Business Owners,etc..' />
                                </div>
                                <div className="form__part select__area__part">
                                    <select name="" id="">
                                        <option selected>Area</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="form__part filter__btn__part">
                                    <button>
                                        <i className="bi bi-sliders"></i>
                                    </button>
                                </div>
                            </>
                            :
                            <>
                                {
                                    categoryArr ?
                                        <div className="form__part select__category__part">
                                            <i className="bi bi-blockquote-right"></i>
                                            <select name="" id="">
                                                {
                                                    categoryArr.map(el => {
                                                        return (
                                                            <option key={el.id} value={el.id}>{el.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        :
                                        ''
                                }
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search for Services, Business Owners,etc..' />
                                </div>
                            </>
                    }
                    <div className="form__part quick__search__btn__part">
                        <button>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

            </div>
            <div className="col-lg-10 col-md-10 col-sm-10 display__on__small__screen">
                <div className="hero__form__bar d-flex justify-content-center">

                    {
                        heroSecContainerType === 'heroSec__container' ?
                            <>
                                {
                                    categoryArr ?
                                        <div className="form__part select__category__part">
                                            <select name="" id="">
                                                {
                                                    categoryArr.map(el => {
                                                        return (
                                                            <option key={el.id} value={el.id}>{el.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        :
                                        ''
                                }
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search for Services, Business Owners,etc..' />
                                </div>
                                {/* <div className="form__part select__area__part">
                                                <select name="" id="">
                                                    <option selected>Area</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div> */}
                                <div className="form__part filter__btn__part">
                                    <button>
                                        <i className="bi bi-sliders"></i>
                                    </button>
                                </div>
                            </>
                            :
                            <>
                                {
                                    categoryArr ?
                                        <div className="form__part select__category__part">
                                            <i className="bi bi-blockquote-right"></i>
                                            <select name="" id="">
                                                {
                                                    categoryArr.map(el => {
                                                        return (
                                                            <option key={el.id} value={el.id}>{el.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        :
                                        ''
                                }
                                <div className="form__part input__search__part">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder='Search for Services, Business Owners,etc..' />
                                </div>
                            </>
                    }
                    <div className="form__part quick__search__btn__part">
                        <button>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
