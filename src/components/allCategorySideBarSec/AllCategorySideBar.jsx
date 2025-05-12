import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import styles from './allCategorySideBar.module.css';

export default function AllCategorySideBar({ industries, show, handleClose, subIndustry, fetchAllContentDatafromSub, fetchAllContentData, setFilterWithCountry,filterWithCountry }) {
    const { subIndustryID } = useParams();
    console.log(subIndustryID);
    console.log(subIndustry);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const handleIndustryClick = (industryId) => {
        setSelectedIndustry((prev) => (prev === industryId ? null : industryId));
        fetchAllContentData()
    };
    const sortedIndustries = [...industries].sort((a, b) => {
        if (a?.slug?.toString() === subIndustryID) return -1;
        if (b?.slug?.toString() === subIndustryID) return 1;
        return 0;
    });
    return (
        <div className=' position-relative'>
            <Offcanvas show={show} onHide={handleClose} responsive="md" className={styles.sidebarOffcanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>All Industries</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav>
                        {sortedIndustries?.map((el) =>
                        {
                            const relatedSubIndustries = subIndustry?.filter(sub => sub.industryId === el.id);
                            return(
                            <div key={el?.id}>
                                {/* Industry Link */}
                                <Link
                                    to={`/all-Industries/${el?.slug}`}
                                    className={`${styles.sidebar__menu} nav-link 
                                    ${subIndustryID === el?.slug?.toString() ? styles.sidebar__menu_active : ''}`}
                                    onClick={() =>{
                                        setFilterWithCountry('')
                                        handleIndustryClick(el?.id)
                                        }
                                    }
                                >
                                    <div className={styles.sidebar__menu__info}>
                                        <i
                                        className={`bi ${subIndustryID === el?.slug?.toString() ? 'bi-chevron-down' : 'bi-chevron-right'}`}
                                        ></i>
                                        <img src={el?.icon} alt="menu-img" />
                                        <h5>{el?.name}</h5>
                                            
                                    </div>
                                </Link>

                                {/* Sub-Industries */}
                                {subIndustryID === el?.slug?.toString() && subIndustry?.length > 0 && (
                                    <div  className={`ps-4 mb-3 ${styles.subIndustryContainer} link-underline`}>
                                        <ul>
                                        {subIndustry.map((sub) => (
                                            <li
                                                key={sub?.id}
                                                // to={`/all-Industries/${el?.slug}/${sub?.slug}`}
                                                onClick={()=>{
                                                    setFilterWithCountry('')
                                                    fetchAllContentDatafromSub(sub?.slug)
                                                }
                                                
                                                }
                                                className={`mb-2 ${styles.subIndustryItem}`}
                                                style={{cursor:'pointer'}}
                                            >
                                                {sub?.name}
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )})}
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
