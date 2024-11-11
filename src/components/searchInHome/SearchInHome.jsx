import React, { useEffect, useState } from 'react'
import { scrollToTop } from '../../functions/scrollToTop';
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
import emailIcon from "../../assets/icons/Duotone 2.png";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyLoader from '../myLoaderSec/MyLoader';

export default function SearchInHome({ countries }) {
    const [loading, setLoading] = useState(true);
    const { search } = useLocation();
    const [currentData, setCurrentData] = useState([]);
    const [filteration, setFilteration] = useState({
        type: '',
        country_id: '',
        name: ''
    });
    const navigate = useNavigate();
    const currCategWantedToFilterFor = [{
        id: 1,
        name: 'companies'
    }]

    const getCurrentSearchedData = async () => {
        const toastId = toast.loading('Loading...');
        await axios.get(`${baseURL}/general-search${search}`, {
            params:{
                t: new Date().getTime(),
            },
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json',

            }
        })
            .then((res) => {
                setCurrentData(res?.data?.data?.companies);
                toast.success(res?.data?.message || 'Data Loaded Successfully!', {
                    id: toastId,
                    duration: 1000
                });
            })
            .catch(err => {
                toast.error(err?.res?.data?.message || 'Something Went Wrong!', {
                    id: toastId,
                    duration: 1000
                });
            });
    };

    useEffect(() => {
        
            getCurrentSearchedData();
        
    }, [search]);
    
    function objectToParams(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== '') {
                params.append(key, obj[key]);
            };
        };
        return params.toString();
    };

    const clearFilteration = () => {
        setFilteration({
            type: '',
            country_id: '',
            name: ''
        });
        navigate('/reach-magnet')
    };

    const handleChange = (e) => {
        setFilteration({ ...filteration, [e.target?.name]: e.target.value });
    };

    useEffect(() => {
        if (filteration.name || filteration.type || filteration.country_id) {
            navigate(`/reach-magnet?${objectToParams(filteration)}`)
        };
    }, [filteration]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className="MyAllCompanies__handler">
                        <div className="container">
                            <div className="row">
                                <h1 className="col-12 mb-5">
                                    General Search
                                </h1>
                                <div className="col-lg-3 col-md-4">
                                    <div className="sidebarForItemsFilter__handler">
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationtitle">
                                                    Filter For
                                                </label>
                                                <select
                                                    name="type"
                                                    id="shopFilterationtitle"
                                                    className="form-select"
                                                    onChange={handleChange}
                                                >
                                                    {
                                                        currCategWantedToFilterFor?.map(categ => (
                                                            <option key={categ?.id} value={categ?.name}>{categ?.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationServ">
                                                    Filter by Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="shopFilterationServ"
                                                    className="form-control"
                                                    placeholder={`Enter your text`}
                                                    value={filteration?.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationServ">
                                                    Filter by Country
                                                </label>
                                                <select
                                                    name="country_id"
                                                    id="shopFilterationServ"
                                                    className="form-select"
                                                    value={filteration?.country_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="" disabled>Choose a Country</option>
                                                    {
                                                        countries?.map(country => (
                                                            <option key={country?.id} value={country?.id}>{country?.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <button className="clearFilterBtn" onClick={clearFilteration}>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-8">
                                    <div className="mainContentAllCompanies__handler">
                                        {currentData?.length === 0 ?
                                            (
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h1 className=" text-danger fs-3 text-capitalize text-center mt-4">
                                                            no company with this filter
                                                        </h1>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            (
                                                <div className="row gap-3">
                                                    {
                                                        currentData?.map((el) => {
                                                            return (
                                                                <div key={el?.companyId} className="col-12">
                                                                    <div className="CompanyContentItem">
                                                                        <div className="compImage">
                                                                            <img
                                                                                src={el?.companyLogo}
                                                                                alt={el?.companyName}
                                                                            />
                                                                        </div>
                                                                        <div className="compMainInfo">
                                                                            <h5 className="mb-2">{el?.companyName}</h5>
                                                                            <div className="companySubInfo mb-2">
                                                                                <div className="subInfoItem">
                                                                                    <img src={userIcon} alt="locateion-icon" />
                                                                                    <span>E-Commerce</span>
                                                                                </div>
                                                                                <div className="subInfoItem">
                                                                                    <img
                                                                                        src={locationIcon}
                                                                                        alt="locateion-icon"
                                                                                    />
                                                                                    <span>
                                                                                        {el?.companyBranches[0]?.branchCity}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="subInfoItem">
                                                                                    <img src={emailIcon} alt="locateion-icon" />

                                                                                    <NavLink to={el?.companyWebsiteLink}>
                                                                                        <span>Website</span>
                                                                                    </NavLink>
                                                                                </div>
                                                                            </div>
                                                                            <div className="companyDescrip mb-2">
                                                                                <p>{el?.companyAboutUs}</p>
                                                                            </div>
                                                                            <div className="companyMainCountry">
                                                                                {/* <img src={flag} alt="flag" /> */}
                                                                                <i className="bi bi-crosshair2"></i>
                                                                                <span>
                                                                                    {el?.companyBranches[0]?.branchCountry}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="companyActions">
                                                                            <NavLink
                                                                                onClick={() => {
                                                                                    scrollToTop();
                                                                                }}
                                                                                className={"nav-link"}
                                                                                to={`/show-company/${el?.companyId}`}
                                                                            >
                                                                                <button className="pageMainBtnStyle">
                                                                                    more info
                                                                                </button>
                                                                            </NavLink>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
