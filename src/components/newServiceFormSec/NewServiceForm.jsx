import React, { useEffect, useState } from 'react'
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import { scrollToTop } from '../../functions/scrollToTop'
import MyLoader from '../myLoaderSec/MyLoader'
import Cookies from 'js-cookie';
import UnAuthSec from '../unAuthSection/UnAuthSec'
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories'

export default function NewServiceForm({ token }) {
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [unAuth, setUnAuth] = useState(false);
    const { id } = useParams();
    const [currSevice, setCurrService] = useState([]);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const mainCategories = GetAllMainCategoriesStore((state) => state.mainCategories);

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        code: '',
        image: '',
    });

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-service/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setCurrService(response?.data?.data);
                    })
                    .catch(error => {
                        toast.error(error?.response?.data?.message || 'Something went wrong!');
                    });
            })();
        };
    }, [id]);

    const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (formData?.category_id) {
                setCurrentSubCategoriesInsideMainCategory([]);
                const selectedCategory = mainCategories.find(
                    (cat) => cat.mainCategoryId === +formData.category_id
                );
                if (selectedCategory) {
                    const slug = selectedCategory.mainCategorySlug;
                    try {
                        const timestamp = new Date().getTime(); // Cache-busting
                        const response = await axios.get(`${baseURL}/main-categories/${slug}?t=${timestamp}`);
                        if (response.status === 200) {
                            setCurrentSubCategoriesInsideMainCategory(response.data.data.subCategories);
                        } else {
                            toast.error('Failed to fetch subcategories');
                        }
                    } catch (error) {
                        if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                            setUnAuth(true);
                        };
                        toast.error('Error fetching subcategories.');
                    };
                };
            };
        };

        fetchSubCategories();
    }, [formData.category_id, mainCategories]);

    useEffect(() => {
        if (currSevice?.id && +currSevice?.id === +id) {
            setFormData({
                title_ar: currSevice?.title_ar || '',
                title_en: currSevice?.title_en || '',
                description_ar: currSevice?.description_ar || '',
                description_en: currSevice?.description_en || '',
                category_id: mainCategories?.find(el => el?.mainCategoryName === currSevice?.category)?.mainCategoryId || '',
                sub_category_id: currentSubCategoriesInsideMainCategory?.find(el => el?.subCategoryName === currSevice.subCategory)?.subCategoryId || '',
                status: 'active',
                code: currSevice?.code || '',
                image: currSevice?.image || '',
            })
        };
    }, [currSevice, id]);

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
            const slugCompletion = id ? `update-service/${id}` : 'add-service';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                navigate('/profile/service');
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Service item Updated Successfully!' : 'service item added successfully!'));
            } else {
                toast.error(id ? 'Failed to update service item!' : 'Failed to add service item!');
            }
        } catch (error) {
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors)
                    .flat()
                    .join('\n'); // Join with newline for separate lines
                toast.error(<div style={{ whiteSpace: 'pre-wrap' }}>{validationErrors}</div>); // Preserve line breaks
            } else {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!');
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
                            {
                                unAuth ?
                                    <UnAuthSec />
                                    :
                                    <div className='newCatalogItem__form__handler'>
                                        <ContentViewHeader title={id ? 'Update Service Item' : 'Add Item to Service'} />
                                        <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="title_en">Product Name in English <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title_en"
                                                            className="form-control"
                                                            placeholder="Enter your text"
                                                            value={formData?.title_en}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="title_ar">Product Name in Arabic <span className='optional'>(optional)</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title_ar"
                                                            className="form-control"
                                                            placeholder="Enter your text"
                                                            value={formData?.title_ar}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="category_id">Category <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <select
                                                            name="category_id"
                                                            className="form-control custom-select"
                                                            value={formData?.category_id}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="" disabled>Select Category</option>
                                                            {mainCategories?.map((cat) => (
                                                                <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>
                                                                    {cat?.mainCategoryName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="sub_category_id">Sub Category <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <select
                                                            name="sub_category_id"
                                                            className="form-control custom-select"
                                                            value={formData?.sub_category_id}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="" disabled>Select Sub Category</option>
                                                            {currentSubCategoriesInsideMainCategory?.map((subCat) => (
                                                                <option key={subCat?.subCategoryId} value={subCat?.subCategoryId}>
                                                                    {subCat?.subCategoryName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="code">service code <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="code"
                                                            className="form-control"
                                                            placeholder="Enter your text"
                                                            value={formData?.code}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="description_en">Description in English <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <textarea
                                                            name="description_en"
                                                            className="form-control"
                                                            rows="5"
                                                            value={formData?.description_en}
                                                            onChange={handleInputChange}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="description_ar">Description in Arabic <span className='optional'>(optional)</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <textarea
                                                            name="description_ar"
                                                            className="form-control"
                                                            rows="5"
                                                            value={formData?.description_ar}
                                                            onChange={handleInputChange}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="upload__image__btn">
                                                <input
                                                    type="file"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form__submit__button">
                                                <button type="submit" className="btn btn-primary">
                                                    {id ? 'Update Service' : 'Add Service'}
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
