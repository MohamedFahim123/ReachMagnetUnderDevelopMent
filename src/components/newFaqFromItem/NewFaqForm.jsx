import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../functions/baseUrl';
import { scrollToTop } from '../../functions/scrollToTop';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';

export default function NewFaqForm({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const { id } = useParams();
    const [currFaq,setCurrFaq] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        question_ar: '',
        question_en: '',
        answer_ar: '',
        answer_en: '',
        status: 'active',
    });

    useEffect(()=>{
        if(id && loginType === 'employee') {
            (async ()=> {
                await axios.get(`${baseURL}/${loginType}/show-faq/${id}?t=${new Date().getTime()}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setCurrFaq(response?.data?.data);
                })
                .catch(error => {
                    toast.error(error?.response?.data?.message || 'Something went wrong!');
                });
            })();
        };
    },[id]);

    useEffect(()=>{
        if(+currFaq?.id === +id){
            formData.question_ar = currFaq?.question;
            formData.question_en = currFaq?.question;
            formData.answer_ar = currFaq?.answer;
            formData.answer_en = currFaq?.answer;
            formData.status = currFaq?.status;
        };
    },[currFaq]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });
        try {
            const slugCompletion = id ? `update-faq/${id}` : 'add-faq';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/faqs')
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Faq updated successfully' : 'Faq added successfully'));
            } else {
                toast.error(id ? 'Failed to update Faq item' : 'Failed to add Faq item');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
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
                            <div className='newCatalogItem__form__handler'>
                                <ContentViewHeader title={id ? 'Update Faq' :'Add New Faq to FAQS'} />
                                <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_en">Faq Question in English <span className="requiredStar"> *</span></label>
                                                <input
                                                    type="text"
                                                    name="question_en"
                                                    className="form-control"
                                                    placeholder="Enter your text"
                                                    value={formData?.question_en}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="catalog__new__input">
                                                <label htmlFor="question_ar">Faq Question in Arabic <span className="requiredStar"> *</span></label>
                                                <input
                                                    type="text"
                                                    name="question_ar"
                                                    className="form-control"
                                                    placeholder="Enter your text"
                                                    value={formData?.question_ar}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_en">Asnwer in English <span className="requiredStar"> *</span></label>
                                                <textarea
                                                    name="answer_en"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_en}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="catalog__new__input">
                                                <label htmlFor="answer_ar">Answer in Arabic <span className="requiredStar"> *</span></label>
                                                <textarea
                                                    name="answer_ar"
                                                    className="form-control"
                                                    rows="5"
                                                    value={formData?.answer_ar}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form__submit__button">
                                        <button type="submit" className="btn btn-primary">
                                            {id? 'Update FAQ' : 'Add New FAQ'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};
