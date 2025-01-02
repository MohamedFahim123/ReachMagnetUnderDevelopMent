import React from 'react'
import './subCategoryMainContent.css'
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
import { Button } from 'react-bootstrap';
export default function SubCategoryMainContent({ contentData, handleShow }) {
console.log(contentData);

    return (
        <div className='subCategoryMainContent__handler mainContentAllCompanies__handler position-relative  mt-5'>
            <div className="d-flex justify-content-end d-md-none">
                <Button variant="" onClick={handleShow} className={'menuButton'}>
                <i className="bi bi-filter"></i>
                   filter Indusries
                </Button>
            </div>
            {
                contentData?.companies?.length !== 0 ?
                    <>
                        {
                            contentData?.companies?.map((el) => (
                                <div key={el?.id} className="mb-5">
                                    <div className="CompanyContentItem">
                                        <div className="compImage">
                                        <NavLink  to={`/show-company/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                            <img
                                                src={el?.companyLogo}
                                                alt={el?.companyName}
                                            />
                                        </NavLink>
                                        </div>
                                        <div className="compMainInfo">
                                            <h5 className="mb-2">
                                                <NavLink to={`/show-company/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                                {el?.companyName}
                                                </NavLink>
                                            </h5>
                                            <div className="companySubInfo mb-2">
                                                <div className="subInfoItem">
                                                    <img src={userIcon} alt="locateion-icon" />
                                                    <span>{el?.companySubCategory}</span>
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
                                                {/* <div className="subInfoItem">
                                        <img src={emailIcon} alt="locateion-icon" />

                                        <NavLink to={el?.companyWebsiteLink}>
                                            <span>Website</span>
                                        </NavLink>
                                    </div> */}
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
                                                to={`/show-company/${el?.companySlug}`}
                                            >
                                                <button className="pageMainBtnStyle">
                                                    more info
                                                </button>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                    :
                    <div className="row container">
                        <div className="col-12">
                            <h1 className=" text-danger fs-3 text-capitalize text-center mt-4">
                                no company with this filter
                            </h1>
                        </div>
                    </div>
            }

        </div>
    )
}
