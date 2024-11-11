import React, { useEffect, useState } from 'react';
import './newCatalogItemForm.css';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie'
import UnAuthSec from '../unAuthSection/UnAuthSec';

export default function NewCatalogItemForm({ mainCategories, token }) {
    const [unAuth, setUnAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType')
    const navigate = useNavigate();
    const { id } = useParams();
    const [currCatalog, setCurrCatalog] = useState([]);
    const allTypes = [
        {
            id: 1,
            name: 'Company provides door-to-door shipping for this item',
        },
        {
            id: 2,
            name: 'Shippable item',
        },

        {
            id: 3,
            name: 'Raw material',
        },
        {
            id: 4,
            name: 'Ready to be used',
        },
        {
            id: 5,
            name: 'Customization available',
        }
    ];
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [allUnitsOfMeasure, setAllUnitsOfMeasure] = useState([])
    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    const [formData, setFormData] = useState({
        title_ar: '',
        title_en: '',
        description_ar: '',
        description_en: '',
        price: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        code: '',
        unit_of_measure_id: '',
        tax: '',
        type: [],
        image: [],
    });
    const fetchUnitsOfMeasure = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/units-of-measure?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllUnitsOfMeasure(response?.data?.data?.units_of_measure);
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchUnitsOfMeasure();
    }, [loginType, token]);

    useEffect(() => {
        if (id && loginType === 'employee') {
            (async () => {
                await axios.get(`${baseURL}/${loginType}/show-catalog/${id}?t=${new Date().getTime()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        setCurrCatalog(response?.data?.data);
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
            if (formData.category_id) {
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
        if (currCatalog?.id && +currCatalog?.id === +id) {
            setFormData({
                title_ar: currCatalog?.title_ar || '',
                title_en: currCatalog?.title_en || '',
                description_ar: currCatalog?.description_ar || '',
                description_en: currCatalog?.description_en || '',
                price: currCatalog?.price || '',
                category_id: mainCategories?.find(el => el?.mainCategoryName === currCatalog?.category)?.mainCategoryId || '',
                sub_category_id: currentSubCategoriesInsideMainCategory?.find(el => el?.subCategoryName === currCatalog?.subCategory)?.subCategoryId || '',
                status: currCatalog?.status,
                code: currCatalog?.code || '',
                unit_of_measure_id: +currCatalog?.unit_of_measure_id || '',
                tax: currCatalog?.tax || '',
                type: currCatalog?.catalogTypes?.map(el => el?.type) || [],
                image: currCatalog?.media?.map(el => el?.image) || [],
            })
        };
    }, [currCatalog]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tax' && value < 0 ) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: 0,
            }));
        }else if(name === 'tax' && value >= 100 ){
            setFormData((prevState) => ({
                ...prevState,
                [name]: 100,
            }));
        }else{
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleCheckboxChange = (id, name) => {
        setFormData((prevState) => {
            const updatedTypes = prevState.type.includes(name)
                ? prevState.type.filter((type) => type !== name)
                : [...prevState.type, name];
            return {
                ...prevState,
                type: updatedTypes,
            };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prevState) => ({
            ...prevState,
            image: files,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== 'image' && !Array.isArray(formData[key])) {
                submissionData.append(key, formData[key]);
            }
        });
        formData.type.forEach((type, index) => {
            submissionData.append(`type[${index}]`, type);
        })
        formData.image.forEach((image, index) => {
            submissionData.append(`image[${index}]`, image);
        })
        try {
            const slugCompletion = id ? `update-catalog/${id}` : 'add-catalog';
            const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                navigate('/profile/catalog');
                scrollToTop()
                toast.success(response?.data?.message || (id ? 'Catalog item updated successfully' : 'Catalog item added successfully'));
            } else {
                toast.error(id ? 'Failed to update catalog item' : 'Failed to add catalog item');
            }
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
        };
        console.log(submissionData);
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
                                <ContentViewHeader title={id ? 'Update Catalog Item' : 'Add Item to Catalog'} />
                                {
                                    unAuth ?
                                        <UnAuthSec />
                                        :
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
                                                <div className="col-lg-6">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="unit_of_measure_id">
                                                            unit of measure <span className="requiredStar"> *</span>
                                                            <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                            </label>
                                                        <select
                                                            name="unit_of_measure_id"
                                                            className="form-control custom-select"
                                                            value={formData?.unit_of_measure_id}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="" disabled>Select unit of measure</option>
                                                            {allUnitsOfMeasure?.map((unit) => (
                                                                <option key={unit?.id} value={unit?.id}>
                                                                    {unit?.unit}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                <div className="catalog__new__input">
                                                        <label htmlFor="code">product code <span className="requiredStar"> *</span>
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
                                            </div>
                                            <div className="row">
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
                                            <div className="row">
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="price">Price <span className='optional'>(optional)</span>
                                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <div className="custom-input-container">
                                                            <input
                                                                type="text"
                                                                id="price"
                                                                name="price"
                                                                className="form-control custom-input"
                                                                placeholder="Enter your text"
                                                                value={formData?.price}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="catalog__new__input">
                                                        <label htmlFor="tax">Tax % <span className='optional'>(optional)</span>
                                                        <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                        </label>
                                                        <div className="custom-input-container">
                                                            <input
                                                                type="number"
                                                                id="cata-tax"
                                                                name="tax"
                                                                min={0}
                                                                max={100}
                                                                className="form-control custom-input"
                                                                placeholder="tax between (0% -100%)"
                                                                value={formData?.tax}
                                                                onChange={handleInputChange}
                                                            />
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="upload__image__btn">
                                                <label htmlFor="tax">
                                                    Add Multible Images 
                                                <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    onChange={handleImageChange}
                                                    className="form-control mt-2"
                                                />
                                            </div>
                                            <div className="catalog__check__points">
                                                {allTypes?.map((type) => (
                                                    <div key={type?.id} className="check__item">
                                                        <div className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                id={`type-${type?.id}`}
                                                                className="form-check-input"
                                                                checked={formData?.type?.includes(type?.name)}
                                                                onChange={() => handleCheckboxChange(type?.id, type?.name)}
                                                            />
                                                            <label htmlFor={`type-${type?.id}`} className="form-check-label">
                                                                {type?.name}
                                                                <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="form__submit__button">
                                                <button type="submit" className="btn btn-primary">
                                                    {id ? 'Update Catalog' : 'Add Catalog'}
                                                </button>
                                            </div>
                                        </form>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

