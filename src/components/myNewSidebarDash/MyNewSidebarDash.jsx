import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import icon2 from '../../assets/sidebar-icons/3d-square 1.svg';
import icon9 from '../../assets/sidebar-icons/discount-shape 1.svg';
import icon6 from '../../assets/sidebar-icons/messages-3.svg';
import icon7 from '../../assets/sidebar-icons/notification.svg';
import icon11 from '../../assets/sidebar-icons/people.svg';
import icon5 from '../../assets/sidebar-icons/status-up.svg';
import icon3 from '../../assets/sidebar-icons/user-square 1.svg';
import icon4 from '../../assets/sidebar-icons/wallet-money 2.svg';
import SideBar from '../sideBar/SideBar';

export default function MyNewSidebarDash({ token }) {
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [collapsed, setCollapsed] = useState(false);
    const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
    const activePath = location.pathname;
    const navigate = useNavigate();

    const handleNavigationToSingleProfilePage = (pageName) => {
        navigate(`${pageName}`)
    }

    const handleGettingLastRouteInPathName = () => {
        const arrOfPathNames = location.pathname.split('/');
        return `/${arrOfPathNames[arrOfPathNames.length - 1]}`
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleSettingsSubmenu = () => {
        setShowSettingsSubmenu(!showSettingsSubmenu);

    }
    const loginType = localStorage.getItem('loginType')

    let sidebarItems = [
        // { title: "Profile", link: "/profile", icon: icon1 },
        { title: "Followers", link: "/profile/followers", icon: icon11 },
        { title: "Product Catalog", link: "/profile/catalog", icon: icon2 },
        { title: "Services", link: "/profile/service", icon: icon2 },
        { title: "Media", link: "/profile/media", icon: icon2 },
        { title: "E-commerce Products", link: "/profile/products", icon: icon4 },
        { title: "Network", link: "/profile/network", icon: icon4 },
        { title: "Previous Work", link: "/profile/previous-work", icon: icon4 },
        { title: "E-commerce Orders", link: "/profile/product-order", icon: icon4 },
        { title: "Collections", link: "/profile/product-order", icon: icon4 },
        { title: "FAQS", link: "/profile/faqs", icon: icon5 },
        { title: "Posts", link: "/profile/posts", icon: icon5 },
        // { title: "Shipping Costs", link: "/profile/shipping-costs", icon: currencyIcon },
        { title: "Quotations", link: "/profile/quotations", icon: icon3 },
        { title: "One-Click Quotations", link: "/profile/oneclick-quotations", icon: icon3 },
        { title: "Quotation Orders", link: "/profile/quotation-orders", icon: icon4 },
        { title: "Appointments", link: "/profile/appointments", icon: icon3 },
        { title: "Booked Appointments", link: "/profile/booked-Appointments", icon: icon3 },
        { title: "Contact Form", link: "/profile/contact-form", icon: icon3 },
        // { title: "Insights", link: "/profile/insights", icon: icon5 },
        { title: "Messages", link: "/your-messages", icon: icon6 },
        { title: "Notifications", link: "/profile/notifications", icon: icon7 },
        {
            title: "Settings",
            link: "/profile/profile-settings",
            icon: icon9,
            // submenu: [
            //     { title: "Profile Settings", link: "/profile/profile-settings" },
            //     { title: "Business Settings", link: "/profile/business-settings" },
            //     { title: "Employees Management", link: "/profile/users-management" }
            // ]
        }
    ];
    if (loginType === 'user') {
        sidebarItems = [
            // { title: "Profile", link: "/profile", icon: icon1 },
            { title: "following", link: "/profile/followers", icon: icon11 },
            // { title: "Catalog", link: "/profile/catalog", icon: icon2 },
            // { title: "Services", link: "/profile/service", icon: icon2 },
            { title: "Quotations", link: "/profile/quotations", icon: icon3 },
            { title: "One-Click Quotations", link: "/profile/oneclick-quotations", icon: icon3 },
            // { title: "Products", link: "/profile/products", icon: icon4 },
            { title: "Quotation Orders", link: "/profile/quotation-orders", icon: icon4 },
            { title: "E-commerce Orders", link: "/profile/product-order", icon: icon4 },
            { title: "Booked Appointments", link: "/profile/booked-Appointments", icon: icon3 },
            // { title: "Insights", link: "/profile/insights", icon: icon5 },
            { title: "Messages", link: "/your-messages", icon: icon6 },
            { title: "Notifications", link: "/profile/notifications", icon: icon7 },
            // { title: "Requests", link: "/profile/requests", icon: icon8 },
            {
                title: "Settings",
                link: "/profile/profile-settings",
                icon: icon9,
                subminue: (localStorage.getItem('loginType') === 'user') ? [
                    { title: "Profile Settings", link: "/profile/profile-settings" }
                ] : [
                    { title: "Profile Settings", link: "/profile/profile-settings" },
                    { title: "Business Settings", link: "/profile/business-settings" },
                    { title: "Employees Management", link: "/profile/users-management" }
                ]
            }
        ];
    }
    // const sidebarItemsTwo = [
    //     { title: "Promote", link: "/business-profile/promote", icon: icon9 },
    //     { title: "Help", link: "/business-profile/help", icon: icon10 }
    // ];
    const userSubmenu = (localStorage.getItem('loginType') === 'user') ? [
        { title: "Profile Settings", link: "/profile/profile-settings" }
    ] : [
        { title: "Profile Settings", link: "/profile/profile-settings" },
        { title: "Business Settings", link: "/profile/business-settings" },
        { title: "Employees Management", link: "/profile/users-management" }
    ];
    const settingsIndex = sidebarItems.findIndex(item => item.title === "Settings");
    if (settingsIndex !== -1) {
        sidebarItems[settingsIndex].submenu = userSubmenu;
    };

    const renderSidebarContent = () => (
        <>
            <ul>
                {sidebarItems.map((el, index) => (
                    <li
                        key={index}
                        className={`d-flex justify-content-between align-items-center 
                            ${el.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''} 
                            ${activePath?.includes(el.link) && !showSettingsSubmenu ? 'active' : ''}
                            ${el.submenu && showSettingsSubmenu ? 'active' : ''}`}
                        onClick={() => {
                            if (el.submenu) {
                                toggleSettingsSubmenu();
                                // if (!show && isMobile) {
                                //     handleShow();
                                // }
                            } else {
                                handleNavigationToSingleProfilePage(el.link);
                            }
                        }}
                    >
                        <Link onClick={isMobile ? handleClose : undefined}>
                            <img src={el.icon} alt={el.title} />
                            <span>{el.title}</span>
                        </Link>
                        {el.submenu ? <i className={`bi ${showSettingsSubmenu ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i> : <i className="bi bi-chevron-right"></i>}
                    </li>
                ))}
                {showSettingsSubmenu && sidebarItems.find(el => el.title === "Settings").submenu.map((subEl, subIndex) => (
                    <li
                        key={subIndex}
                        className={`d-flex justify-content-between align-items-center submenu 
                            ${activePath === subEl.link ? 'active' : ''}`}
                        onClick={() => handleNavigationToSingleProfilePage(subEl.link)}
                        style={{ paddingLeft: '15px' }}
                    >
                        <Link to={subEl.link} onClick={isMobile ? handleClose : undefined}>
                            <span>{subEl.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {/* <ul className='listItems__two'>
                {sidebarItemsTwo.map((el, index) => (
                    <li
                        key={index}
                        className={`d-flex justify-content-between align-items-center 
                    ${activePath === el.link ? 'active' : ''}`}>
                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                            <img src={el.icon} alt={el.title} />
                            <span>{el.title}</span>
                        </Link>
                        <i className="bi bi-chevron-right"></i>
                    </li>
                ))}
            </ul> */}
            <div className="pro__banner__handler text-center">
                <div className="pro__banner__content">
                    <h3>Upgrade to PRO to get access to all Features!</h3>
                    <NavLink className='nav-link'>
                        Get Pro Now!
                    </NavLink>
                </div>
            </div>
        </>
    );
    return (
        <>
            {isMobile ? (
                <>
                    <div className='mySidebar__handler'>
                        <div className='container'>
                            <ul>
                                <li onClick={handleShow} className="sidebar-toggle text-center">
                                    ☰
                                </li>
                                {sidebarItems.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            <img src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {/* <ul className='listItems__two'>
                                {sidebarItemsTwo.map((el, index) => (
                                    <li key={index} className={`d-flex justify-content-center align-items-center ${activePath === el.link ? 'active' : ''}`}>
                                        <Link to={el.link} onClick={isMobile ? handleClose : undefined}>
                                            <img src={el.icon} alt={el.title} />
                                        </Link>
                                    </li>
                                ))}
                            </ul> */}
                        </div>

                    </div>

                    <Offcanvas show={show} onHide={handleClose} className="mySidebar__handler">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>
                                <h1 className="logo__text cursorPointer">
                                    <NavLink className={'nav-link'} to={'/'}>
                                        ReachMag<span className='letter__color'>n</span>et
                                    </NavLink>
                                </h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {renderSidebarContent()}
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            ) : (
                <div className="mySidebar__handler mySideBarNewContainer">
                    <div>
                        {
                            !collapsed &&
                            <h1 className="logo__text mb-3 cursorPointer">
                                <NavLink className={'nav-link'} to={'/'}>
                                    ReachMag<span className='letter__color'>n</span>et
                                </NavLink>
                            </h1>
                        }
                        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} sidebarItems={sidebarItems} />

                        {/* {renderSidebarContent()} */}
                    </div>
                </div>
            )}
        </>
    )
}
