import React, { useEffect, useState } from 'react'
import MyLoader from '../myLoaderSec/MyLoader'
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash'
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import UnAuthSec from '../unAuthSection/UnAuthSec'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { baseURL } from '../../functions/baseUrl'
import toast from 'react-hot-toast'

export default function CatalogOptionForm({ token }) {
    const [unAuth, setUnAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const [previewImages, setPreviewImages] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [currCatalog, setCurrCatalog] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newOptions, setNewOptions] = useState([]);
    console.log(id);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

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

    const handleAddOptionField = () => {
        setNewOptions([...newOptions, { attribute: '', newValue: true , value: '', price: '', values:[{name:'', price:''}] }]);
    };
    useEffect(()=>{
       if (currCatalog?.options) {
        setNewOptions([...currCatalog?.options])
       }
    },[id, currCatalog])

    const handleAddValue = (optionIndex)=>{
        setNewOptions(newOptions?.map((el, idx)=>{
            if (idx === optionIndex) {
                if (el?.attribute_id) {
                    return {...el, values: [...el.values, {name:'', price:'', isAdded: true}] }
                }else{
                    return {...el, values: [...el.values, {name:'', price:''}] }
                }
            }
            return el
        }))
    }

    const handleInputChange = (index, field, value) => {
        const updatedOptions = [...newOptions];
        updatedOptions[index][field] = value;
        setNewOptions(updatedOptions);
    };

    const handleSubmitChanges = async () => {
        if (!newOptions.length) {
            toast.error('Add at least one new option!');
            return;
        }

        for (const option of newOptions) {
            if (!option.attribute || !option.value || !option.price) {
                toast.error('All fields are required for new options!');
                return;
            }

            try {
                const payload = {
                    catalog_id: `${currCatalog.id}`,
                    attribute: option.attribute,
                    values: [
                        {
                            name: option.value,
                            price: option.price,
                        },
                    ],
                };
                await axios.post(`${baseURL}/${loginType}/add-new-option-catalog`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success(`Option "${option.attribute}" added successfully!`);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to add option!');
            }
        }

        // Clear new options after submission
        // setNewOptions([]);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);
    console.log(currCatalog);

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
                                <ContentViewHeader title={`update option for ${currCatalog?.title_en}`} />
                                {
                                    unAuth ?
                                        <UnAuthSec />
                                        :
                                        <form className="catalog__form__items">


                                            <h3>Add New Options</h3>

                {newOptions?.map((option, index) => (
                    <div key={index} className="option-group my-3">
                        <div className="row my-3">
                            <div className="col-lg-6">
                                <input
                                    style={{
                                        background: 'rgb(142 149 235 / 40%)'
                                    }}
                                    disabled={option?.attribute_id}
                                    type="text"
                                    placeholder="Attribute (e.g., Storage)"
                                    value={option?.attribute}
                                    // onChange={(e) => handleOptionChange(index, 'attribute', e.target.value)}
                                    className="form-control"

                                />
                            </div>
                            { option?.attribute_id &&
                                <div className="col-lg-6 ">
                                <button className='btn btn-outline-danger'>
                                    delete full option
                                </button>
                            </div>
                            }
                        </div>
                        {option?.values?.map((value, valueIndex) => (
                            <div key={valueIndex} className="row">
                                <div className="col-lg-4">
                                    <input
                                        disabled={value?.id}
                                        type="text"
                                        placeholder="Option Name (e.g., 128 GB)"
                                        value={value?.name}
                                        // onChange={(e) =>
                                        //     handleValueChange(
                                        //         index,
                                        //         valueIndex,
                                        //         'name',
                                        //         e.target.value
                                        //     )
                                        // }
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <input
                                        disabled={value?.id}
                                        type="text"
                                        placeholder="Price Impact"
                                        value={value?.price}
                                        // onChange={(e) =>
                                        //     handleValueChange(
                                        //         index,
                                        //         valueIndex,
                                        //         'price',
                                        //         e.target.value
                                        //     )
                                        // }
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-3">
                                    { value?.isAdded &&
                                        <button type='button' onClick={()=>{
                                        handleAddValue(index)
                                    }} className='btn btn-outline-success mt-3'>
                                        submit value
                                    </button>
                                    }
                                </div>
                            </div>

                        ))}
                        <button type='button' onClick={()=>{
                            handleAddValue(index)
                        }} className='btn btn-outline-success mt-3'>
                            add value
                        </button>
                        { option?.newValue &&
                            <button type='button' onClick={()=>{
                                handleAddValue(index)
                            }} className='btn btn-outline-success mt-3'>
                                submit option
                            </button>
                        }
                    </div>
                ))}
                                            <button type="button" onClick={handleAddOptionField} className="btn btn-secondary mt-4">
                                                Add New Option Field
                                            </button>
                                        </form>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
