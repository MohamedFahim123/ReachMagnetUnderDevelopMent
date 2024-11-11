import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import styles from './allCategorySideBar.module.css';

export default function AllCategorySideBar({ industries, show, handleClose }) {
    const { subIndustryID } = useParams();
    return (
        <div className=' position-relative'>
            <Offcanvas show={show} onHide={handleClose} responsive="md" className={styles.sidebarOffcanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>All Industries</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav>
                        {industries?.map((el) => (
                            <Link
                                key={el?.id}
                                to={`/all-Industries/${el?.id}`}
                                className={`${styles.sidebar__menu} nav-link
                                ${subIndustryID === el?.id.toString() ? styles.sidebar__menu_active : ''}`}
                            >
                                <div className={`${styles.sidebar__menu__info}`}>
                                    <img src={el?.icon} alt="menu-img" />
                                    <h5>{el?.name}</h5>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}
