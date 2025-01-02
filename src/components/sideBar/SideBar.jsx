import React, { useEffect } from 'react';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaCog } from 'react-icons/fa';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import './sideBar.css';
import styles from './sideBar.module.css';

export default function SideBar({ collapsed, setCollapsed, sidebarItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const handleGettingLastRouteInPathName = () => {
    const arrOfPathNames = location.pathname.split('/');
    return `/${arrOfPathNames[arrOfPathNames.length - 1]}`
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      };
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  return (
    <div className='mySideBarNew'>
      <Sidebar collapsed={collapsed} className={`${styles.sideBarContainer}`}>
        <div className='d-flex justify-content-center my-2'>
          {
            collapsed ? (
              <FaArrowAltCircleRight className='cursorPointer' size={25} onClick={() => setCollapsed(!collapsed)} />
            ) : (
              <FaArrowAltCircleLeft className='cursorPointer' onClick={() => setCollapsed(!collapsed)} size={30} />
            )
          }
        </div>
        <Menu>
          {
            sidebarItems?.map((item, index) => (
              <div key={index} >
                {
                  item?.submenu ? (
                    <SubMenu
                      className={`
                    ${item.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''}
                    ${ collapsed && 'displayListNoneForSettings d-flex justify-content-between align-items-center '}
                    `}
                      label="Settings"
                      icon={<FaCog />}
                    >
                      {
                        item?.submenu?.map((subEl, subIndex) => (
                          <MenuItem
                            key={subIndex}
                            onClick={() => navigate(subEl.link)}
                            className={`d-flex justify-content-between align-items-center 
                            ${item.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''}`}
                          >
                            {subEl.title}
                          </MenuItem>
                        ))
                      }
                    </SubMenu>
                  )
                    :
                    (
                      <MenuItem
                        key={index}
                        onClick={() => navigate(item.link)}
                        className={`d-flex justify-content-between align-items-center 
                        ${item.link.endsWith(handleGettingLastRouteInPathName()) ? 'active' : ''}
                        `}
                      >
                        <img src={item?.icon} alt={item?.title} />
                        {item.title}
                      </MenuItem >
                    )
                }
              </div>
            ))
          }
        </Menu>
      </Sidebar >
    </div>
  );
};