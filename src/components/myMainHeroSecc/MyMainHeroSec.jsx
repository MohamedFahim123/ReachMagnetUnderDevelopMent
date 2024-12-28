import React, { useState } from 'react'
import './myMainHeroSec.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyMainHeroSec({ countries, handleChangeFilterInputs, heroSecContainerType, currentPage, headText, paraPartOne, paraPartTwo, categoryArr, currentCompanyChosen }) {
    const [submitSearchData, setSubmitSearchData] = useState({
        name: '',
        country_id: ''
    });
    const navigate = useNavigate();

    function objectToParams(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== '') {
                params.append(key, obj[key]);
            };
        };
        return params.toString();
    };

    const handleChangeSearchData = (e) => {
        setSubmitSearchData({ ...submitSearchData, [e.target.name]: e.target.value });
    };

    const handleSubmitSearchData = () => {
        const slug = objectToParams(submitSearchData);
        if (!slug) {
            toast.error("You need to add a filter to search");
        } else {
            navigate(`reach-magnet?${slug}`);
        }
    };
console.log(countries);

    return (
        <div className={`myMainHero__handler `}>
            <div className="container">
                <div className={`${heroSecContainerType} ${heroSecContainerType === 'heroSec__container' ? '' : 'overlay30'}`}>
                    <div className="row justify-content-center position-relative">
                        <div className="col-lg-12">
                            <h1>
                                {
                                    headText ? headText : ''
                                }
                            </h1>
                            <p>
                                {paraPartOne}
                                {paraPartTwo}
                            </p>
                        </div>
                        <div className="col-lg-10 col-md-10 col-sm-10  justify-content-center d-flex">
                            <div className="hero__form__bar justify-content-center">

                                {
                                    heroSecContainerType === 'heroSec__container' ?
                                        <>
                                            {
                                                categoryArr ?
                                                    <div className="form__part select__category__part ">
                                                        <select className='form-select' name='type' onChange={handleChangeSearchData}>
                                                            {
                                                                categoryArr?.map(el => {
                                                                    return (
                                                                        <option key={el.id} value={el.value}>{el.name}</option>
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
                                                <input id='searchByNameHomePage' name='name' type="text" defaultValue={''} onChange={handleChangeSearchData} placeholder='Search by Companies, Products and Services' />
                                            </div>
                                            <div className="form__part select__area__part ">
                                                <select
                                                    defaultValue={''}
                                                    name="country_id"
                                                    onChange={handleChangeSearchData}
                                                    className='form-select'
                                                    id="homeSearchForCountryId"
                                                >
                                                    <option value="" disabled>Select Country</option>
                                                    {countries?.map(country => (
                                                        <option value={country?.id} key={country?.id}>
                                                            {country?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {
                                                categoryArr ?
                                                    <div className="form__part select__category__part">
                                                        <i className="bi bi-blockquote-right"></i>
                                                        <select defaultValue={currentCompanyChosen} name='company' onChange={handleChangeFilterInputs}>
                                                            {currentPage === 'shop' && <option disabled value="">Select Country</option>}
                                                            {
                                                                categoryArr?.map(el => {
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
                                                <input type="text" name='title' onChange={handleChangeFilterInputs} placeholder={currentPage === 'shop' && 'Search with Product Name'} />
                                            </div>
                                        </>
                                }
                                <div className="form__part quick__search__btn__part">
                                    <button onClick={handleSubmitSearchData}>
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                        {/* <div className="col-lg-10 col-md-10 col-sm-10 display__on__small__screen">
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

                        </div> */}
                    </div>
                </div>

            </div>
        </div>
    )
}
