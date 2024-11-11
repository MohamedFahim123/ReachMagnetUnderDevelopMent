import React, { useEffect, useRef, useState } from 'react';
import MyNewSidebarDash from '../../components/myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../../components/mainContentHeaderSec/MainContentHeader';
import cover from '../../assets/signUpImages/cover2.png';
import Profile from '../../assets/signUpImages/profile2.png';
import camerIcon from '../../assets/signUpImages/camera-icon.png';
import ProfileFilterBar from '../../components/profileFilterBarSec/ProfileFilterBar';
import CompanySettingsForm from '../../components/companySettingsFormSec/CompanySettingsForm';
import CompanyActivitiesForm from '../../components/companyActivitiesFormSec/CompanyActivitiesForm';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import CompanyWorkHourForm from '../../components/companyWorkHourFormItem/CompanyWorkHourForm';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import UnAuthSec from '../../components/unAuthSection/UnAuthSec';

localStorage.setItem('updatingCompany', 'notUpdating');
localStorage.setItem('updatingCompanyActivities', 'notUpdating');

export default function MyBussinessSettings({ token, mainCategories }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [company, setCompany] = useState({});
    const [currentImage, setCurrentImage] = useState(null);
    const [profileUpdateStatus, setProfileUpdateStatus] = useState(localStorage.getItem('updatingCompany'));
    const [currnetImageUpdateFile, setCurrentImageUpdateFile] = useState(undefined);
    const [currnetImageUpdateError, setCurrentImageUpdateError] = useState('');
    const [imgChanged, setImageChanged] = useState(false);
    const [currentCoverImage, setCurrentCoverImage] = useState(null);
    const [currnetCoverUpdateFile, setCurrentCoverUpdateFile] = useState(undefined);
    const [currnetCoverUpdateError, setCurrentCoverUpdateError] = useState('');
    const [imgCoverChanged, setImageCoverChanged] = useState(false);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const companyUpdated = Cookies.get('currentUpdatedCompanyData') ? false : true;
    const [unAuth, setUnAuth] = useState(false);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            if (localStorage.getItem('loginType') === 'employee') {
                setCurrentUserLogin(newShape);
            } else if (localStorage.getItem('loginType') === 'user') {
                setCurrentUserLogin(newShape);
            };
        };
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    useEffect(() => {
        const companyUpdatedDataInCookies = Cookies.get('currentUpdatedCompanyData');
        if (companyUpdatedDataInCookies) {
            const newShape = JSON.parse(companyUpdatedDataInCookies);
            if (newShape) {
                setCompany(newShape);
                setCurrentImage(newShape?.logo);
                setCurrentCoverImage(newShape?.cover);
            };
        };
    }, [Cookies.get('currentUpdatedCompanyData')]);

    useEffect(() => {
        if (companyUpdated) {
            if (loginType === 'employee' && token) {
                (async () => {
                    const toastId = toast.loading('Loading...');
                    try {
                        const response = await axios.get(`${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json'
                            },
                        });
                        setCompany(response?.data?.data);
                        setCurrentImage(response?.data?.data?.logo);
                        setCurrentCoverImage(response?.data?.data?.cover);
                        toast.success('Company Loaded Successfully', {
                            id: toastId,
                            duration: 2000
                        });
                        Cookies.set('currentUpdatedCompanyData', JSON.stringify(response?.data?.data));
                    } catch (error) {
                        if(error?.response?.data?.message === 'Unauthorized'){
                            setUnAuth(true);
                        };
                        toast.error(error?.response?.data?.message || 'Something Wrong Happend!', {
                            id: toastId,
                            duration: 2000
                        });
                    }
                })();
            };
        };
    }, []);

    const [activeItem, setActiveItem] = useState('Company Settings');
    const items = [
        { name: 'Company Settings', active: activeItem === 'Company Settings' },
        { name: 'Company Activities', active: activeItem === 'Company Activities' },
        { name: 'Company Work Hours', active: activeItem === 'Company Work Hours' },
    ];
    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        if (profileUpdateStatus !== 'notUpdating') {
            fileInputRef.current.click();
        }
    };
    const hangleChangeImage = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const newFileUrl = URL.createObjectURL(selectedFile);
            setCurrentImage(newFileUrl);
            setImageChanged(true);
        };
        setCurrentImageUpdateFile(event.target.files);
    };

    const fileCoverRef = useRef(null);
    const handleCoverClick = () => {
        if (profileUpdateStatus !== 'notUpdating') {
            fileCoverRef.current.click();
        }
    };
    const hangleChangeCover = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const newFileUrl = URL.createObjectURL(selectedFile);
            setCurrentCoverImage(newFileUrl);
            setImageCoverChanged(true);
        };
        setCurrentCoverUpdateFile(event.target.files);
    };

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
                    <div className='dashboard__handler d-flex'>
                        <MyNewSidebarDash />
                        <div className='main__content container'>
                            <MainContentHeader currentUserLogin={currentUserLogin} />
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='content__view__handler position-relative'>
                                        <div className="profileCoverImg">
                                            <img src={(currentCoverImage === 'N/A') ? cover : currentCoverImage} alt="Cover" />
                                        </div>
                                        <div className={`updateCover ${profileUpdateStatus === 'updating' && 'cursorPointer d-block'}`}>
                                            {
                                                profileUpdateStatus !== 'notUpdating' &&
                                                <>
                                                    <input type="file" className='invisibleInput' ref={fileCoverRef} onChange={hangleChangeCover} />
                                                    <span onClick={handleCoverClick}><i className="bi bi-pencil-square"></i></span>
                                                </>
                                            }
                                        </div>
                                        {
                                            currnetCoverUpdateError &&
                                            <>
                                                {toast.error(`${currnetCoverUpdateError}`)}
                                                {setCurrentCoverUpdateError(null)}
                                            </>
                                        }
                                        <div className="profile__settings__content row justify-content-center">
                                            <div className="left__settings__content col-lg-4">
                                                <div className="change__img__box">
                                                    <div className="profile__image__box">
                                                        <img src={currentImage === 'N/A' ? Profile : currentImage} alt="profile" />
                                                    </div>
                                                    <div className={`camera__icon ${profileUpdateStatus === 'updating' ? 'cursorPointer' : 'd-none'}`}>
                                                        {
                                                            profileUpdateStatus === 'updating' &&
                                                            <input type="file" className='invisibleInput' ref={fileInputRef} onChange={hangleChangeImage} />
                                                        }
                                                        <img src={camerIcon} alt="camera" onClick={handleImageClick} />
                                                    </div>
                                                </div>
                                                {
                                                    currnetImageUpdateError &&
                                                    (<span className='errorMessage text-center d-block mb-3'>{currnetImageUpdateError}</span>)
                                                }
                                                <div className="user__name__info">
                                                    <h3>
                                                        {company?.name}
                                                    </h3>
                                                </div>
                                                <div className="view__profile__btn">
                                                    <button>
                                                        View company's public profile
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="right__settings__content col-lg-7">
                                                <div className="profile__filter__bar">
                                                    <ProfileFilterBar items={items} onItemClick={handleItemClick} />
                                                </div>
                                                <div className="profile__form__inputs mt-3">
                                                    {activeItem === 'Company Settings'

                                                        &&
                                                        <CompanySettingsForm
                                                            setUnAuth={setUnAuth}
                                                            token={token}
                                                            imgChanged={imgChanged}
                                                            currnetImageUpdateFile={currnetImageUpdateFile}
                                                            setCurrentImageUpdateError={setCurrentImageUpdateError}
                                                            coverChanged={imgCoverChanged}
                                                            currnetCoverUpdateFile={currnetCoverUpdateFile}
                                                            setCurrentCoverUpdateError={setCurrentCoverUpdateError}
                                                            setProfileUpdateStatus={setProfileUpdateStatus}
                                                            company={company}
                                                            profileUpdateStatus={profileUpdateStatus}
                                                            mainCategories={mainCategories}
                                                        />

                                                    }
                                                    {activeItem === 'Company Activities'
                                                        &&
                                                        <CompanyActivitiesForm
                                                            setUnAuth={setUnAuth}
                                                            token={token}
                                                        />
                                                    }
                                                    {activeItem === 'Company Work Hours'
                                                        &&
                                                        <CompanyWorkHourForm
                                                            setUnAuth={setUnAuth}
                                                            token={token}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
            }
        </>
    );
};
