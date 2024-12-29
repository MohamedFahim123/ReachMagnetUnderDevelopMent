import React, { useEffect, useState } from 'react';
import './newCatalogItemForm.css';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie'
import UnAuthSec from '../unAuthSection/UnAuthSec';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';

export default function NewCatalogItemForm({ token }) {
    const [unAuth, setUnAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [previewImages, setPreviewImages] = useState([]);
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
    const [allUnitsOfMeasure, setAllUnitsOfMeasure] = useState([]);

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
        price: '',
        category_id: '',
        sub_category_id: '',
        status: 'active',
        code: '',
        unit_of_measure_id: '',
        tax: '',
        type: [],
        image: [],
        options: []
    });
    
    const handleAddOption = () => {
        setFormData(prevState => ({
            ...prevState,
            options: [...prevState.options, { attribute: '', values: [{ name: '', price: '' }] }]
        }));
    };

    const handleAddValue = (optionIndex) => {
        const updatedOptions = [...formData.options];
        updatedOptions[optionIndex].values.push({ name: '', price: '' });
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index][field] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleValueChange = (optionIndex, valueIndex, field, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[optionIndex].values[valueIndex][field] = value;
        setFormData({ ...formData, options: updatedOptions });
    };


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
    
    console.log(currCatalog);

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
                options: currCatalog?.options?.map(el => el) || []
            })
        };
    }, [currCatalog]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tax' && value < 0) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: 0,
            }));
        } else if (name === 'tax' && value >= 100) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: 100,
            }));
        } else {
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

        // Update previews
        const newPreviews = files.map((file, index) => ({
            id: `${file.name}-${index}-${Date.now()}`,
            preview: URL.createObjectURL(file),
        }));

        // Update formData with raw file objects
        setFormData((prevState) => ({
            ...prevState,
            image: [...prevState.image, ...files],
        }));

        // Update previewImages state
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    };

    const handleImageDelete = (id) => {
        const imageToRemove = previewImages.find((img) => img.id === id);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview); // Revoke URL
        }
        setPreviewImages((prev) => prev.filter((img) => img.id !== id));
        setFormData((prevState) => ({
            ...prevState,
            image: prevState.image.filter((_, index) =>
                previewImages.findIndex((img) => img.id === id) !== index
            ),
        }));
    };

    const handleBookmarkClick = (id) => {
        // Find the index of the clicked image
        const clickedIndex = previewImages.findIndex((img) => img.id === id);

        if (clickedIndex === 0) return; // If it's already the first image, do nothing

        // Rearrange the previewImages array
        const updatedPreviews = [
            previewImages[clickedIndex], // Move clicked image to the front
            ...previewImages.filter((_, index) => index !== clickedIndex), // Keep others
        ];

        // Rearrange the formData.image array
        const updatedImages = [
            formData.image[clickedIndex], // Move clicked image to the front
            ...formData.image.filter((_, index) => index !== clickedIndex), // Keep others
        ];

        setPreviewImages(updatedPreviews);
        setFormData((prevState) => ({
            ...prevState,
            image: updatedImages,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();

        // Append normal fields
        Object.keys(formData).forEach((key) => {
            if (key !== 'options' && key !== 'image') {
                submissionData.append(key, formData[key]);
            }
        });
        formData.type.forEach((type, index) => {
                    submissionData.append(`type[${index}]`, type);
                })
        // Append options
        formData.options.forEach((option, optionIndex) => {
            submissionData.append(`options[${optionIndex}][attribute]`, option.attribute);
            option.values.forEach((value, valueIndex) => {
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][name]`, value.name);
                submissionData.append(`options[${optionIndex}][values][${valueIndex}][price]`, value.price);
            });
        });

        // Append images
        formData.image.forEach((file, index) => {
            submissionData.append(`image[${index}]`, file);
        });

        const toastId = toast.loading('Submitting...');
        try {
            const url = id
                ? `${baseURL}/employee/update-catalog/${id}`
                : `${baseURL}/employee/add-catalog`;
            await axios.post(url, submissionData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Catalog saved successfully!', { id: toastId });
            navigate('/profile/catalog');
            scrollToTop();
        } catch (error) {
            toast.error('Failed to save catalog.', { id: toastId });
        
            if (error.response && error.response.data) {
              const errors = error.response.data.errors;
        
              if (errors) {
                // Display all errors in a single toast message
                const allErrors = Object.values(errors).flat().join(', '); 
                toast.error(`Validation Errors: ${allErrors}`, { id: toastId }); 
              }
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
                                                        <label htmlFor="code">product code <span className='optional'>(optional)</span>
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
                                                    Add Multiple Images
                                                    <i title='sss' className="bi bi-info-circle ms-1 cursorPointer"></i>
                                                </label>
                                                <input
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    onChange={handleImageChange}
                                                    className="form-control mt-2"
                                                />
                                                <div className="image-preview mt-4">
                                                    {previewImages.map((image, index) => (
                                                        <div key={image.id} className="position-relative d-inline-block me-4">
                                                            <img
                                                                src={image.preview}
                                                                alt="Selected"
                                                                className="img-thumbnail"
                                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                            />
                                                            <i
                                                                className={`bi bi-bookmark-star-fill ${index === 0 ? "text-warning" : "text-secondary"
                                                                    } position-absolute bottom-0 start-0 cursor-pointer`}
                                                                style={{ fontSize: "1.5rem", transform: "translate(-50%, 50%)" }}
                                                                onClick={() => handleBookmarkClick(image.id)}
                                                                title="Set as Main Image"
                                                            ></i>
                                                            <i
                                                                className="bi bi-x-circle text-danger position-absolute top-0 end-0 cursor-pointer"
                                                                style={{ fontSize: "1.5rem", transform: "translate(50%, -50%)" }}
                                                                onClick={() => handleImageDelete(image.id)}
                                                                title="Remove Image"
                                                            ></i>
                                                        </div>
                                                    ))}
                                                </div>



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
   { !id &&
    <div className="row">
        <div className="col-lg-12">
            <div style={{
                marginTop: '30px',
                borderTop: "1px solid #aaa"
            }} className="catalog__new__input">
                <label className="fw-bold my-3">Options and variations</label>
                <button type="button" className="btn btn-link" onClick={handleAddOption}>Add Option</button>
                {formData?.options?.map((option, index) => (
                    <div key={index} className="option-group my-3">
                        <div className="row">
                            <div className="col-lg-6">
                                <input
                                style={{
                                    background: 'rgb(142 149 235 / 40%)'
                                }}
                                    type="text"
                                    placeholder="Attribute (e.g., Storage)"
                                    value={option?.attribute}
                                    onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                    className="form-control"

                                />
                            </div>
                        </div>
                        {option?.values?.map((value, valueIndex) => (
                            <div key={valueIndex} className="row">
                                <div className="col-lg-6">
                                    <input
                                        type="text"
                                        placeholder="Option Name (e.g., 128 GB)"
                                        value={value?.name}
                                        onChange={(e) =>
                                            handleValueChange(
                                                index,
                                                valueIndex,
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <input
                                        type="text"
                                        placeholder="Price Impact"
                                        value={value?.price}
                                        onChange={(e) =>
                                            handleValueChange(
                                                index,
                                                valueIndex,
                                                'price',
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddValue(index)} className="btn btn-link">Add Value</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
    } 
    {
        id &&
        <div className="row">
        <div className="col-lg-12">
            <div style={{
                marginTop: '30px',
                borderTop: "1px solid #aaa"
            }} className="catalog__new__input">
                <label className="fw-bold my-3">Options and variations</label>
                <div className='text-end'>
                    <NavLink to={`/profile/catalog/edit-item/${id}/edit-option`}>
                    <button className='btn btn-outline-primary text-capitalize'>
                        edit options <i className="bi bi-pencil-square"></i>
                    </button>
                    </NavLink>
                </div>
                {formData?.options?.map((option, index) => (
                    <div key={index} className="option-group my-3">
                        <div className="row">
                            <div className="col-lg-6">
                                <input
                                style={{
                                    background: 'rgb(142 149 235 / 40%)'
                                }}
                                    disabled
                                    type="text"
                                    placeholder="Attribute (e.g., Storage)"
                                    value={option?.attribute}
                                    onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                    className="form-control"

                                />
                            </div>
                        </div>
                        {option?.values?.map((value, valueIndex) => (
                            <div key={valueIndex} className="row">
                                <div className="col-lg-6">
                                    <input
                                        disabled
                                        type="text"
                                        placeholder="Option Name (e.g., 128 GB)"
                                        value={value?.name}
                                        onChange={(e) =>
                                            handleValueChange(
                                                index,
                                                valueIndex,
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <input
                                        disabled
                                        type="text"
                                        placeholder="Price Impact"
                                        value={value?.price}
                                        onChange={(e) =>
                                            handleValueChange(
                                                index,
                                                valueIndex,
                                                'price',
                                                e.target.value
                                            )
                                        }
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        ))}
                       
                    </div>
                ))}
            </div>
        </div>
        </div>
    }
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

