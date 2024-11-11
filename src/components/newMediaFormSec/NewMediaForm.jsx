import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import UnAuthSec from '../unAuthSection/UnAuthSec';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function NewMediaForm({token}) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const { id } = useParams();
    const [currMedia, setCurrMedia] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        type: '',
        image: '',
        link: ''
    });

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/company-portfolio/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setCurrMedia(response?.data?.data?.portfolio);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    useEffect(() => {
        if (+currMedia?.id === +id) {
            formData.type = currMedia?.type;
            formData.image = currMedia?.link;
            formData.link = currMedia?.link;
            
        };
    }, [currMedia]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = (e.target.files);
        setFormData((prevState) => ({
            ...prevState,
            image: files[0],
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'image' && formData[key] instanceof File) {
                submissionData.append(key, formData[key]);
            } else {
                submissionData.append(key, formData[key]);
            };
        });

        try {
            const slugCompletion = id ? `update-company-portfolio/${id}` : 'add-company-portfolio';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/media');
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Media item Updated Successfully!' : 'Media item added successfully!'));
            } else {
                toast.error(id ? 'Failed to update Media item!' : 'Failed to add Media item!');
            }
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        };
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
                                    <div className='newCatalogItem__form__handler'>
                                        <ContentViewHeader title={id ? 'Update Media Item' :'Add Item to Media'} />
                                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="category_id"> 
                                                            {id ? 'Edit' : 'Choose'} Type of Media
                                                            <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <select
                                                            name="type"
                                                            className="form-control custom-select"
                                                            value={formData?.type}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="" disabled>Select Type
                                                            </option>
                                                            <option 
                                                            key="image"
                                                            value="image">
                                                                Image
                                                            </option>
                                                            <option 
                                                            key="link"
                                                            value="link">
                                                                Video
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {
                                                    formData?.type === 'image' &&
                                                    <div className="col-lg-8">
                                                        <div className="upload__image__btn ">
                                                        <label htmlFor="image" style={{marginBottom: '8px', fontSize: '16px', fontWeight: '400'}}>{id ? 'Edit' : 'Add'} Image<span className="requiredStar"> *</span>
                                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            onChange={handleImageChange}
                                                            className="form-control"
                                                        />
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    formData?.type === 'link' &&
                                                    <div className="col-lg-8">
                                                        <div className="catalog__new__input">
                                                            <label htmlFor="link">{id ? 'Edit' : 'Add'} Link video 
                                                            <span className='optional'>(link must be youtube format)</span>
                                                            <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="link"
                                                                className="form-control"
                                                                placeholder="Enter your link"
                                                                value={formData?.link}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                
                                            </div>
                                            <div className="form__submit__button">
                                                <button type="submit" className="btn btn-primary">
                                                    {id ? 'Update Media' : 'Add Media'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                            }
                        </div>
                    </div>
    }
    </>
  )
}
