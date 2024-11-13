import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash';
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader';
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import { GetAllCountriesStore } from '../../store/AllCountries';
import { GetAllMainCategoriesStore } from '../../store/AllMainCategories';

export default function NewProductForm({ token}) {
  const countries = GetAllCountriesStore((state) => state.countries);
  const loginType = localStorage.getItem('loginType');
  const navigate = useNavigate();
  const [currentUserLogin, setCurrentUserLogin] = useState(null);
  const { id } = useParams();
  const [currProd, setCurrProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    brand_id: '',
    category_id: '',
    sub_category_id: '',
    country_id: '',
    unit_of_measure_id: '',
    dangerous_id: [],
    image: [],

    price: '',  /*nullable if has variations*/
    tax: '',    /*nullable or (0 - 100 ) %*/
    discount_type: '',   /*nullable if has variations  or (fixed || percent) */
    discount_amount: '',  /*nullable if has variations */
    total_stock: '', /*nullable if has variations */
    dimensions_with_package: '', /*nullable if has variations */
    dimensions_without_package: '', /*nullable if has variations */
    weight: '', /*nullable if has variations */
    has_variation: 'no',     /*yes || no*/
    has_sub_variation: 'no', /*yes || no*/
    variation_name: '',
    sub_variation_name: '',
    variations: [
      {
        value: "",
        price: "", /*nullable if has sub variations */
        stock: "", /*nullable if has sub variations */
        sku: "", /*nullable if has sub variations */
        dimensions_with_package: "",/*nullable if has sub variations */
        dimensions_without_package: "", /*nullable if has sub variations */
        weight: "", /*nullable if has sub variations */
        images: [], /*nullable if has sub variations */
        sub_variations: [
          {
            value: "",
            price: "",
            stock: "",
            sku: "",
            dimensions_with_package: "",
            dimensions_without_package: "",
            weight: "",
            images: []
          },
        ]
      }
    ]
  });
  const [dangerouses, setDangerouses] = useState([])
  const [productBrand, setProductBrand] = useState([])
  const [allUnits, setAllUnits] = useState([])
  const mainCategories = GetAllMainCategoriesStore((state) => state.mainCategories);

  const fetchAllDangerouse = async () => {

    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-dangerouses?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDangerouses(response?.data?.data?.dangerouses);
    }
    catch (error) {
      toast.error(error?.response?.data.message || 'Faild To get Products dangerouses!');
    };


  };
  const fetchAllBrands = async () => {

    try {
      const response = await axios.get(`${baseURL}/${loginType}/all-brands?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProductBrand(response?.data?.data?.brands);
    }
    catch (error) {
      toast.error(error?.response?.data.message || 'Faild To get Products brands!');
    };


  };
  const fetchUintsOFMeasure = async () => {
    try {
      const response = await axios.get(`${baseURL}/${loginType}/units-of-measure?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllUnits(response?.data?.data?.units_of_measure);
    }
    catch (error) {
      toast.error(error?.response?.data.message || 'Faild To get Products brands!');
    };


  };
  useEffect(() => {
    fetchAllDangerouse()
    fetchAllBrands()
    fetchUintsOFMeasure()
  }, [loginType, token]);
  useEffect(() => {
    const cookiesData = Cookies.get('currentLoginedData');
    if (!currentUserLogin) {
      const newShape = JSON.parse(cookiesData);
      setCurrentUserLogin(newShape);
    }
  }, [Cookies.get('currentLoginedData'), currentUserLogin]);

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
            };
          } catch (error) {
            toast.error('Error fetching subcategories.');
          }
        }
      }
    };

    fetchSubCategories();
  }, [formData.category_id, mainCategories]);

  useEffect(() => {
    if (id && loginType === 'employee') {
      (async () => {
        await axios.get(`${baseURL}/${loginType}/show-product/${id}?t=${new Date().getTime()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            setCurrProd(response?.data?.data);
          })
          .catch(error => {
            toast.error(error?.response?.data?.message || 'Something went wrong!');
          });
      })();
    };
  }, [id]);

  useEffect(() => {
    if (+currProd?.id === +id) {
      formData.price = currProd?.price;
      formData.discount_price = currProd?.discountPrice;
      formData.total_stock = currProd?.totalStock;
      formData.title_en = currProd?.title;
      formData.title_ar = currProd?.title;
      formData.description_en = currProd?.description;
      formData.description_ar = currProd?.description;
      formData.category_id = mainCategories?.find(el => el?.mainCategoryName === currProd?.category)?.mainCategoryId;
      formData.sub_category_id = currentSubCategoriesInsideMainCategory?.find(el => el?.subCategoryName === currProd.subCategory)?.subCategoryId;
      if (currProd?.productAttribute?.length > 0) {
        formData.has_variation = 'yes';
        if (formData.has_variation === 'yes') {
          formData.attribute_ar = currProd?.productAttribute;
          formData.attribute_en = currProd?.productAttribute;
          formData.variation_name_ar = currProd?.productAttributeValues?.map(el => el?.value);
          formData.variation_name_en = currProd?.productAttributeValues?.map(el => el?.value);
          formData.stock = currProd?.productAttributeValues?.map(el => el?.stock);
        };
      };
    };
  }, [currProd]);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: [...prevState.image, ...e.target.files]
    }));
  };

  // Add a new variation
  const addVariation = () => {
    setFormData((prevState) => ({
      ...prevState,
      variations: [
        ...prevState.variations,
        {
          variation_name: '',
          value: '',
          price: '',
          stock: '',
          sku: '',
          description: '',
          dimensions_with_package: '',
          dimensions_without_package: '',
          weight: '',
          images: [],
          sub_variations: [
            {
              sub_variation_name: '',
              value: '',
              price: '',
              stock: '',
              sku: '',
              description: '',
              dimensions_with_package: '',
              dimensions_without_package: '',
              weight: '',
              images: []
            }
          ]
        }
      ]
    }));
  };

  // Add a new sub-variation
  const addSubVariation = (variationIndex) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[variationIndex].sub_variations.push({
      sub_variation_name: '',
      value: '',
      price: '',
      stock: '',
      sku: '',
      description: '',
      dimensions_with_package: '',
      dimensions_without_package: '',
      weight: '',
      images: []
    });
    setFormData((prevState) => ({ ...prevState, variations: updatedVariations }));
  };



  // Handle changes for variations
  const handleVariationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariations = [...formData.variations];
    updatedVariations[index][name] = value;
    setFormData((prevState) => ({ ...prevState, variations: updatedVariations }));
  };

  // Handle changes for sub-variations
  const handleSubVariationChange = (varIndex, subVarIndex, e) => {
    const { name, value } = e.target;
    const updatedVariations = [...formData.variations];
    updatedVariations[varIndex].sub_variations[subVarIndex][name] = value;
    setFormData((prevState) => ({ ...prevState, variations: updatedVariations }));
  };

  // Handle file uploads for variations or sub-variations
  const handleVariationFileChange = (index, e) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[index].images = [...updatedVariations[index].images, ...e.target.files];
    setFormData((prevState) => ({ ...prevState, variations: updatedVariations }));
  };

  const handleSubVariationFileChange = (varIndex, subVarIndex, e) => {
    const updatedVariations = [...formData.variations];
    updatedVariations[varIndex].sub_variations[subVarIndex].images = [
      ...updatedVariations[varIndex].sub_variations[subVarIndex].images,
      ...e.target.files
    ];
    setFormData((prevState) => ({ ...prevState, variations: updatedVariations }));
  };

  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleSelectType = (id) => {
    const type = dangerouses?.find((item) => item.id === Number(id));

    if (type && !selectedTypes.some((item) => item.id === type.id)) {
      const updatedSelectedTypes = [...selectedTypes, type];
      setSelectedTypes(updatedSelectedTypes);
      setFormData((prevFormData) => ({
        ...prevFormData,
        dangerous_id: [...prevFormData.dangerous_id, type.id],
      }));
    }
  };

  const handleDeleteType = (id) => {
    const updatedSelectedTypes = selectedTypes.filter((item) => item.id !== id);
    setSelectedTypes(updatedSelectedTypes);

    setFormData((prevFormData) => ({
      ...prevFormData,
      dangerous_id: prevFormData.dangerous_id.filter((typeId) => typeId !== id),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    // Construct FormData based on has_variation and has_sub_variation
    if (formData.has_variation === 'yes') {
      formData.variations.forEach((variation, index) => {
        submissionData.append(`variations[${index}][variation_name]`, variation.variation_name);
        submissionData.append(`variations[${index}][value]`, variation.value);

        if (formData.has_sub_variation === 'no') {
          ['price', 'stock', 'sku', 'dimensions_with_package', 'dimensions_without_package', 'weight'].forEach((field) => {
            submissionData.append(`variations[${index}][${field}]`, variation[field]);
          });

          variation.images.forEach((file, fileIndex) => {
            submissionData.append(`variations[${index}][images][${fileIndex}]`, file);
          });
        } else {
          variation.sub_variations.forEach((subVar, subIndex) => {
            ['sub_variation_name', 'value', 'price', 'stock', 'sku', 'dimensions_with_package', 'dimensions_without_package', 'weight'].forEach((field) => {
              submissionData.append(`variations[${index}][sub_variations][${subIndex}][${field}]`, subVar[field]);
            });

            subVar.images.forEach((file, fileIndex) => {
              submissionData.append(`variations[${index}][sub_variations][${subIndex}][images][${fileIndex}]`, file);
            });
          });
        }
      });
    }
    else {
      ['price', 'total_stock', 'dimensions_with_package', 'dimensions_without_package', 'weight'].forEach((field) => {
        submissionData.append(field, formData[field]);
      });
    }
    Object.keys(formData).forEach((key) => {
      if (key !== 'variations' && key !== 'image' && !Array.isArray(formData[key])) {
        submissionData.append(key, formData[key]);
      } else if (key !== 'variations' && key !== 'image' && Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          submissionData.append(`${key}[${index}]`, item);
        });
      } else if (key === 'image' && key !== 'variations') {
        Array.from(formData[key]).forEach((file, index) => {
          submissionData.append(`${key}[${index}]`, file);
        });
      } else if (key === 'variations') {
        console.log(key);

      }

    });
    try {
      const slugCompletion = id ? `update-product/${id}` : 'create-product';
      const response = await axios.post(`${baseURL}/${loginType}/${slugCompletion}`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/profile/products')
        scrollToTop()
        toast.success(response?.data?.message || (id ? 'product item updated successfully!' : 'product item added successfully!'));
      } else {
        toast.error((id ? 'Failed to update product item!' : 'Failed to add product item!'));
      };
    } catch (error) {
      // If it's a validation error, handle it
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors;
        
        // Loop through the error messages and show each as a toast
        Object.keys(errorMessages).forEach((field) => {
          errorMessages[field].forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        // Handle any other errors
        toast.error('Something went wrong, please try again.');
      }
    }
  };
  console.log("formData", formData);

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
                <div className='newCatalogItem__form__handler'>
                  <ContentViewHeader title={`${id ? 'Update Product' : 'Add New product'}`} />
                  <form className="catalog__form__items" onSubmit={handleFormSubmit}>
                    <div className="row">
                      {/* prod name */}
                      <div className="col-lg-6">
                        <div className="catalog__new__input">
                          <label htmlFor="title_en">Product Name in English</label>
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
                          <label htmlFor="title_ar">Product Name in Arabic</label>
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
                      {/* Category and sub */}
                      <div className="col-lg-6">
                        <div className="catalog__new__input">
                          <label htmlFor="category_id">Category</label>
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
                          <label htmlFor="sub_category_id">Sub Category</label>
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
                      {/* Discription */}
                      <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="description_en">Description in English</label>
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
                          <label htmlFor="description_ar">Description in Arabic</label>
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
                      {/* Origin, Brand, unit, Danger */}
                      <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="country_id">Origin</label>
                          <select
                            name="country_id"
                            className="form-control custom-select"
                            value={formData?.country_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>Select Origin</option>
                            {countries?.slice(0, 197)?.map((cat) => (
                              <option key={cat?.id} value={cat?.id}>
                                {cat?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="brand_id">Brand</label>
                          <select
                            name="brand_id"
                            className="form-control custom-select"
                            value={formData?.brand_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>Select brand</option>
                            {productBrand?.map((cat) => (
                              <option key={cat?.id} value={cat?.id}>
                                {cat?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="unit_of_measure_id">Unit OF Measure:</label>
                          <select
                            name="unit_of_measure_id"
                            className="form-control custom-select"
                            value={formData?.unit_of_measure_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>Select brand</option>
                            {allUnits?.map((cat) => (
                              <option key={cat?.id} value={cat?.id}>
                                {cat?.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="dangerous_id">
                            Danger Alert
                          </label>
                          <select
                            id="dangerous_id"
                            className="form-control custom-select"
                            onChange={(e) => {
                              handleSelectType(e.target.value)
                            }
                            }
                            value=''
                          >
                            <option value="" disabled>Select Danger</option>
                            {dangerouses?.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>

                          <div className="selected__types" style={{ marginTop: '10px' }}>
                            {selectedTypes.map((type) => (
                              <span className="chosen__choice" key={type.id}
                              >
                                {type.name}
                                <i
                                  onClick={() => handleDeleteType(type.id)}
                                  className="bi bi-trash chosen__choice-delete"

                                ></i>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-8">
                        <div className="catalog__new__input">
                          <label htmlFor="tax">tax</label>
                          <input
                            type="text"
                            name="tax"
                            className="form-control"
                            placeholder="tax (%)"
                            value={formData.tax}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="catalog__new__input">
                          <label htmlFor="discount_type">Discount Type</label>
                          <select
                            name="discount_type"
                            className="form-control custom-select"
                            value={formData.discount_type}
                            onChange={handleInputChange}>
                            <option value="" disabled>Discount Type</option>
                            <option value="fixed">fixed</option>
                            <option value="percent">percentage %</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="catalog__new__input">
                          <label htmlFor="discount_amount">Discount Amount</label>
                          <input
                            type="text"
                            name="discount_amount"
                            className="form-control"
                            placeholder="Discount Amount"
                            value={formData.discount_amount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                    </div>
                    {
                      formData.has_variation === 'no' && (
                        <div className="row">
                          {/* nullable if has variations */}
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="price">price</label>
                              <input
                                type="text"
                                name="price"
                                className="form-control"
                                placeholder="price"
                                value={formData.price}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="dimensions_with_package">Dimensions With Package</label>
                              <input
                                type="text"
                                name="dimensions_with_package"
                                className="form-control"
                                placeholder="Dimensions With Package"
                                value={formData.dimensions_with_package}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="dimensions_without_package">Dimensions Without Package</label>
                              <input
                                type="text"
                                name="dimensions_without_package"
                                className="form-control"
                                placeholder="Dimensions Without Package"
                                value={formData.dimensions_without_package}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="weight">Weight</label>
                              <input
                                type="text"
                                name="weight"
                                className="form-control"
                                placeholder="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="total_stock">Total Stock</label>
                              <input
                                type="text"
                                name="total_stock"
                                className="form-control"
                                placeholder="total_stock"
                                value={formData.total_stock}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    }

                    {/* product main images */}
                    <div className="upload__image__btn col-md-8">
                      <input
                        type="file"
                        name="image"
                        multiple
                        onChange={handleFileChange}
                        className="form-control"
                      />
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="catalog__new__input">
                          <label htmlFor="has_variation">product has variatoin</label>
                          <select
                            name="has_variation"
                            className="form-control custom-select"
                            value={formData.has_variation}
                            onChange={handleInputChange}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                      </div>
                      {
                        formData.has_variation === 'yes' && (
                          <div className="col-lg-6">
                            <div className="catalog__new__input">
                              <label htmlFor="has_sub_variation">product has sub variatoin</label>
                              <select
                                name="has_sub_variation"
                                value={formData.has_sub_variation}
                                className="form-control custom-select"
                                onChange={handleInputChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                              </select>
                            </div>
                          </div>
                        )
                      }
                    </div>


                    {formData.has_variation === 'yes' && (
                      <>
                        <div className="col-lg-6">
                          <div className="catalog__new__input">
                            <label htmlFor="variation_name">Variation Name</label>
                            <input
                              type="text"
                              name="variation_name"
                              className="form-control"
                              placeholder="Variation Name"
                              value={formData.variation_name}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          {
                            formData.has_sub_variation === 'yes' && (
                              <div className="catalog__new__input">
                                <label htmlFor="sub_variation_name">Sub Variation Name</label>
                                <input
                                  type="text"
                                  name="sub_variation_name"
                                  className="form-control"
                                  placeholder="Sub-Variation Name"
                                  value={formData.sub_variation_name}
                                  onChange={handleInputChange}
                                />
                              </div>
                            )
                          }
                        </div>

                        {/* Render variations and sub-variations */}
                        {formData.variations.map((variation, varIndex) => (
                          <div key={varIndex} className='row'>
                            <div className="col-12">
                             <h1 className='fs-3 fw-bold my-3'>
                              Variation #{varIndex + 1}
                             </h1>
                            </div>
                            <div className="col-lg-6">
                              <div className="catalog__new__input">
                                <label htmlFor="value">Variation Value</label>
                                <input
                                  type="text"
                                  name="value"
                                  className="form-control"
                                  placeholder="Variation value"
                                  value={variation.value}
                                  onChange={(e) => handleVariationChange(varIndex, e)}
                                />
                              </div>
                            </div>
                            {
                              formData.has_sub_variation === 'no' && (
                                // only show when there is no sub variation
                                <>
                                  <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                      <label htmlFor="price">price</label>
                                      <input
                                        type="text"
                                        name="price"
                                        className="form-control"
                                        placeholder="price"
                                        value={variation.price}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                      <label htmlFor="dimensions_with_package">Dimensions With Package</label>
                                      <input
                                        type="text"
                                        name="dimensions_with_package"
                                        className="form-control"
                                        placeholder="Dimensions With Package"
                                        value={variation.dimensions_with_package}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="catalog__new__input">
                                      <label htmlFor="dimensions_without_package">Dimensions Without Package</label>
                                      <input
                                        type="text"
                                        name="dimensions_without_package"
                                        className="form-control"
                                        placeholder="Dimensions Without Package"
                                        value={variation.dimensions_without_package}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-8">
                                    <div className="catalog__new__input">
                                      <label htmlFor="weight">Weight</label>
                                      <input
                                        type="text"
                                        name="weight"
                                        className="form-control"
                                        placeholder="weight"
                                        value={variation.weight}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-8">
                                    <div className="catalog__new__input">
                                      <label htmlFor="stock">Stock</label>
                                      <input
                                        type="text"
                                        name="stock"
                                        className="form-control"
                                        placeholder="stock"
                                        value={variation.stock}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-8">
                                    <div className="catalog__new__input">
                                      <label htmlFor="sku">Sku</label>
                                      <input
                                        type="text"
                                        name="sku"
                                        className="form-control"
                                        placeholder="sku"
                                        value={variation.sku}
                                        onChange={(e) => handleVariationChange(varIndex, e)}
                                      />
                                    </div>
                                  </div>
                                  <div className="upload__image__btn col-md-8">
                                    <input
                                      type="file"
                                      name="images"
                                      multiple
                                      onChange={(e) => handleVariationFileChange(varIndex, e)}
                                      className="form-control"
                                    />
                                  </div>
                                </>
                              )
                            }
                            {formData.has_sub_variation === 'yes' && variation.sub_variations.map((subVar, subVarIndex) => (
                              <>
                              <div className="col-12">
                             <h1 className='fs-5 my-3'>
                              Sub Variation #{`${(varIndex + 1)}.${(subVarIndex +1)}`}
                             </h1>
                            </div>
                                <div className="col-lg-6">
                                  <div className="catalog__new__input">
                                    <label htmlFor="value">Sub Variation Value</label>
                                    <input
                                      type="text"
                                      name="value"
                                      className="form-control"
                                      placeholder="sub-Variation value"
                                      value={subVar.value}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="catalog__new__input">
                                    <label htmlFor="price">price</label>
                                    <input
                                      type="text"
                                      name="price"
                                      className="form-control"
                                      placeholder="price"
                                      value={subVar.price}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="catalog__new__input">
                                    <label htmlFor="dimensions_with_package">Dimensions With Package</label>
                                    <input
                                      type="text"
                                      name="dimensions_with_package"
                                      className="form-control"
                                      placeholder="Dimensions With Package"
                                      value={subVar.dimensions_with_package}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="catalog__new__input">
                                    <label htmlFor="dimensions_without_package">Dimensions Without Package</label>
                                    <input
                                      type="text"
                                      name="dimensions_without_package"
                                      className="form-control"
                                      placeholder="Dimensions Without Package"
                                      value={subVar.dimensions_without_package}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-8">
                                  <div className="catalog__new__input">
                                    <label htmlFor="weight">Weight</label>
                                    <input
                                      type="text"
                                      name="weight"
                                      className="form-control"
                                      placeholder="weight"
                                      value={subVar.weight}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-8">
                                  <div className="catalog__new__input">
                                    <label htmlFor="stock">Stock</label>
                                    <input
                                      type="text"
                                      name="stock"
                                      className="form-control"
                                      placeholder="stock"
                                      value={subVar.stock}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-8">
                                  <div className="catalog__new__input">
                                    <label htmlFor="sku">Sku</label>
                                    <input
                                      type="text"
                                      name="sku"
                                      className="form-control"
                                      placeholder="sku"
                                      value={subVar.sku}
                                      onChange={(e) => handleSubVariationChange(varIndex, subVarIndex, e)}
                                    />
                                  </div>
                                </div>
                                <div className="upload__image__btn col-md-8">
                                  <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={(e) => handleSubVariationFileChange(varIndex, subVarIndex, e)}
                                    className="form-control"
                                  />
                                </div>
                              </>

                            ))}
                            {
                              formData.has_sub_variation === 'yes' && (
                                <div className="row">
                                  <div className="col-12 d-flex justify-content-end">
                                    <button type="button" className='btn btn-info text-light mb-3' onClick={() => addSubVariation(varIndex)}>
                                      + Add Sub-Variation
                                    </button>
                                  </div>
                                </div>

                              )
                            }
                          </div>
                        ))}
                        <button type="button" className="btn btn-outline-success mb-5" onClick={addVariation}>Add Variation</button>
                      </>
                    )}
                    <div className="form__submit__button">
                      <button type="submit" className="btn btn-primary">
                        {id ? 'Update Product Item' : 'Add Product Item'}
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
