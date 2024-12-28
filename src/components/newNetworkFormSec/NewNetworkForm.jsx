import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';

export default function NewNetworkForm({token}) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currNetwork,setCurrNetwork] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        name: '',
        label: '',
        logo: '',
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/show-company-network/${id}?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setCurrNetwork(response?.data?.data?.network);
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    useEffect(()=>{
        if(currNetwork?.id && +currNetwork.id === +id){
            setFormData({
                name: currNetwork?.name || '',
                label: '',
                logo: currNetwork?.logo || '',
            });
            
        };
    },[currNetwork, id]);

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
            logo: files[0],
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        const toastId = toast.loading('Loading...');
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        try {
            const slugCompletion = id ? `update-company-network/${id}` : 'add-company-network';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {

                navigate('/profile/network')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'network updated successfully' : 'network added successfully'),{
                    id: toastId,
                    duration: 1000
                });
            } else {
                toast.error(id ? 'Failed to update the network' : 'Failed to add network',{
                        id: toastId,
                        duration: 2000
                });
            };
        }  catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n'); // Join with newline for separate lines
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>,{
                        id: toastId,
                        duration: 2000
                }); // Preserve line breaks
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!',{
                        id: toastId,
                        duration: 2000
                });
            }
        }
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
                    <div className='newCatalogItem__form__handler'>
                        <ContentViewHeader title={id ? 'Update network' : 'Add new network'} />
                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="name">Add Company Name<span className="requiredStar"> *</span>
                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Enter your text"
                                            value={formData?.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                        <label htmlFor="label">Type of Connection<span className="requiredStar"> *</span>
                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                        </label>
                                        <select
                                            name="label"
                                            className="form-control custom-select"
                                            value={formData?.label}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled>Select Type of Connection</option>
                                            <option value="client">Client</option>
                                            <option value="partener">Partner</option>
                                            {/* <option value="agent">Agent</option> */}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="upload__image__btn ">
                                <label htmlFor="label" className='mb-2'>Add Company logo<span className="requiredStar"> *</span>
                                </label>
                                <input
                                    type="file"
                                    name="logo"
                                    onChange={handleImageChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form__submit__button">
                                <button type="submit" className="btn btn-primary">
                                    {id ? 'Update Network' : 'Add Network'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    }
</>
  )
}
