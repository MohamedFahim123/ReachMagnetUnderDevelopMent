import React, { useEffect } from 'react';
import './mainContentHeader.css';
import MySearchSec from '../mySearchSec/MySearchSec';
import messageIcon from '../../assets/companyImages/messages-3.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { GetAllChatsStore } from '../../store/AllChats';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';


export default function MainContentHeader({ isSidebarExpanded, search, placeholder, currentUserLogin, filteration, setFilteration, name, inputType }) {
    const navigate = useNavigate();
    const allRead = GetAllChatsStore((state) => state.allRead);
    const getAllChats = GetAllChatsStore((state) => state.getAllChats);
    const getAllCountries = GetAllCountriesStore((state) => state.getAllCountries);
    const getAllMainCategories = GetAllMainCategoriesStore((state) => state.getAllMainCategories);
    useEffect(() => {
        getAllChats();
        getAllCountries(); 
        getAllMainCategories();
    }, [getAllChats, getAllCountries,getAllMainCategories]);

    return (
        <div className={`mainContentHeader__handler  ${isSidebarExpanded ? 'expanded' : ''}`}>
            <div className="content__header d-flex justify-content-between  align-items-center flex-wrap">
                <h1>
                    Hello {currentUserLogin?.name?.split(' ')[0]} 👋🏼,
                </h1>

                <div className='d-flex align-items-center flex-wrap gap-2'>
                    {
                        search &&
                        <MySearchSec name={name} placeholder={placeholder} filteration={filteration} setFilteration={setFilteration} inputType={inputType} />
                    }
                    <button onClick={() => navigate(`/your-messages`)} className='btn__companyActions online__btn'>
                        <NavLink className={'nav-link'}
                        >
                            <img src={messageIcon} alt="message-icon" />
                            {
                                allRead === false &&
                                <span className="red__dot"></span>
                            }
                        </NavLink>
                    </button>
                    <NavLink className='btn btn-outline-success p-2 ms-2' to='/'>
                        <i className="bi bi-box-arrow-left "></i>
                        <span className='ms-2'>Back To Home</span>
                    </NavLink>
                </div>

            </div>
        </div>
    )
}
