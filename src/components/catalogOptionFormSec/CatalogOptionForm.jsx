import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { baseURL } from '../../functions/baseUrl'
import ContentViewHeader from '../contentViewHeaderSec/ContentViewHeader'
import MainContentHeader from '../mainContentHeaderSec/MainContentHeader'
import MyLoader from '../myLoaderSec/MyLoader'
import MyNewSidebarDash from '../myNewSidebarDash/MyNewSidebarDash'
import UnAuthSec from '../unAuthSection/UnAuthSec'

export default function CatalogOptionForm({ token, currPage }) {
    const [unAuth, setUnAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const loginType = localStorage.getItem('loginType');
    const { id } = useParams();
    const [currCatalog, setCurrCatalog] = useState([]);
    const [currService, setCurrService] = useState([]);
    const [currentUserLogin, setCurrentUserLogin] = useState(null);
    const [newOptions, setNewOptions] = useState([]);
    const [underUpdating, setUnderUpdating] = useState(undefined);

    useEffect(() => {
        const cookiesData = Cookies.get('currentLoginedData');
        if (!currentUserLogin) {
            const newShape = JSON.parse(cookiesData);
            setCurrentUserLogin(newShape);
        }
    }, [Cookies.get('currentLoginedData'), currentUserLogin]);

    useEffect(() => {
        if (id && loginType === 'employee') {
            if (currPage === 'catalog') {
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
            } else {
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
        };
    }, [currPage, id, loginType, token]);

    const handleAddOptionField = () => {
        setNewOptions([...newOptions, { attribute: '', newValue: true, values: [{ name: '', price: '' }] }]);
    };

    useEffect(() => {
        if (currCatalog?.options) {
            setNewOptions([...currCatalog?.options]);
        } else if (currService?.options) {
            setNewOptions([...currService?.options]);
        };
    }, [id, currCatalog, currService])

    const handleAddValue = (optionIndex) => {
        setNewOptions(newOptions?.map((el, idx) => {
            if (idx === optionIndex) {
                if (el?.attribute_id) {
                    return { ...el, values: [...el.values, { name: '', price: '', isAdded: true }] }
                } else {
                    return { ...el, values: [...el.values, { name: '', price: '' }] }
                }
            }
            return el
        }))
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handleSetValueEnableToEdit = (id) => setUnderUpdating(id);

    const updateOptionsValuesArray = (idx, valueIndex, name, value) => {
        setNewOptions(newOptions?.map((el, i) => {
            if (i === idx) {
                return {
                    ...el,
                    values: el.values.map((val, valIdx) => {
                        if (valIdx === valueIndex) {
                            return {
                                ...val,
                                [name]: value
                            };
                        };
                        return val;
                    })
                };
            };
            return el;
        }));
    };

    const updateOptionAttribute = (idx, value) => {
        setNewOptions(newOptions?.map((el, i) => {
            if (i === idx) {
                return { ...el, attribute: value };
            };
            return el;
        }));
    };

    const handleAddValueToExistedOption = async (idx, vIdx) => {
        const option = newOptions?.find((_, i) => +i === +idx);
        const value = option?.values?.find((_, i) => +i === +vIdx);
        const data = currPage === 'catalog' ?
            {
                catalog_id: `${currCatalog?.id}`,
                attribute_id: `${option?.attribute_id}`,
                name: value?.name,
                price: value?.price,
            }
            :
            {
                service_id: `${currService?.id}`,
                attribute_id: `${option?.attribute_id}`,
                name: value?.name,
                price: value?.price,
            };
        const url = currPage === 'catalog' ?
            `${baseURL}/${loginType}/add-value-to-option-catalog`
            :
            `${baseURL}/${loginType}/add-value-to-option-service`;
        const toastId = toast.loading(`Loading...`);
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: `application/json`,
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(res?.data?.message || 'Value Added Successfully!', {
                id: toastId,
                duration: 1000
            });
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!', {
                id: toastId,
                duration: 1500
            });
        };
    };

    const handleUpdateValueData = async (idx, vIdx) => {
        const option = newOptions?.find((_, i) => +i === +idx);
        const value = option?.values?.find((_, i) => +i === +vIdx);
        const data = currPage === 'catalog' ?
            {
                catalog_id: `${currCatalog?.id}`,
                attribute_id: `${option?.attribute_id}`,
                prefrence_attribute_value_id: `${value?.value_id}`,
                name: value?.name,
                price: value?.price,
            }
            :
            {
                service_id: `${currService?.id}`,
                attribute_id: `${option?.attribute_id}`,
                prefrence_attribute_value_id: `${value?.value_id}`,
                name: value?.name,
                price: value?.price,
            };
        const url = currPage === 'catalog' ?
            `${baseURL}/${loginType}/update-value-in-option-catalog`
            :
            `${baseURL}/${loginType}/update-value-in-option-service`;
        const toastId = toast.loading(`Loading...`);
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: `application/json`,
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(res?.data?.message || 'Value Updated Successfully!', {
                id: toastId,
                duration: 1000
            });
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!', {
                id: toastId,
                duration: 1500
            });
        };
    };

    const handleDeleteOptionValueExisted = async (idx, vIdx) => {
        const option = newOptions?.find((_, i) => +i === +idx);
        const value = option?.values?.find((_, i) => +i === +vIdx);
        const data = currPage === 'catalog' ?
            {
                catalog_id: `${currCatalog?.id}`,
                prefrence_attribute_value_id: `${value?.value_id}`,
            }
            :
            {
                service_id: `${currService?.id}`,
                prefrence_attribute_value_id: `${value?.value_id}`,
            };
        const url = currPage === 'catalog' ?
            `${baseURL}/${loginType}/delete-value-in-option-catalog`
            :
            `${baseURL}/${loginType}/delete-value-in-option-service`;
        const toastId = toast.loading(`Loading...`);
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: `application/json`,
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(res?.data?.message || 'Value Deleted Successfully!', {
                id: toastId,
                duration: 1000
            });
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!', {
                id: toastId,
                duration: 1500
            });
        };
    };

    const handleDeleteFullOption = async (idx) => {
        const option = newOptions?.find((_, i) => +i === +idx);
        const data = currPage === 'catalog' ?
            {
                catalog_id: `${currCatalog?.id}`,
                attribute_id: `${option?.attribute_id}`,
            }
            :
            {
                service_id: `${currService?.id}`,
                attribute_id:`${option?.attribute_id}`,
            };
        const url = currPage === 'catalog' ?
            `${baseURL}/${loginType}/delete-full-option-catalog`
            :
            `${baseURL}/${loginType}/delete-full-option-service`;
        const toastId = toast.loading(`Loading...`);
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: `application/json`,
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(res?.data?.message || 'Option Deleted Successfully!', {
                id: toastId,
                duration: 1000
            });
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!', {
                id: toastId,
                duration: 1500
            });
        };
    };

    const handleAddNewOption = async (idx) => {
        const option = newOptions?.find((_, i) => +i === +idx);
        const data = currPage === 'catalog' ?
            {
                catalog_id: `${currCatalog?.id}`,
                attribute: option?.attribute,
                values: option?.values,
            }
            :
            {
                service_id: `${currService?.id}`,
                attribute: option?.attribute,
                values: option?.values,
            };
        const toastId = toast.loading('Loading...');
        const url = currPage === 'catalog' ?
            `${baseURL}/${loginType}/add-new-option-catalog`
            :
            `${baseURL}/${loginType}/add-new-option-service`;
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: `application/json`,
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(res?.data?.message || 'Option Added Successfully!', {
                id: toastId,
                duration: 1000
            });
            window.location.reload();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!', {
                id: toastId,
                duration: 1500
            });
        };
    };

    console.log(newOptions)

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
                                <ContentViewHeader title={`update option for ${currCatalog?.title_en || currService?.title_en}`} />
                                {
                                    unAuth ?
                                        <UnAuthSec />
                                        :
                                        <div className="catalog__form__items">
                                            {newOptions?.map((option, index) => (
                                                <>
                                                    <div key={index} className="option-group my-3">
                                                        <h5 className='fw-semibold mt-4'>
                                                            Option #{index + 1}
                                                        </h5>
                                                        <div className="row my-3">
                                                            <div className="col-lg-6">
                                                                <input
                                                                    style={{
                                                                        background: 'rgb(142 149 235 / 40%)'
                                                                    }}
                                                                    disabled={option?.attribute_id}
                                                                    type="text"
                                                                    placeholder="Attribute (e.g., Storage)"
                                                                    defaultValue={option?.attribute}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        updateOptionAttribute(index, value)
                                                                    }}
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            {
                                                                option?.attribute_id &&
                                                                <div
                                                                    className="col-lg-6"
                                                                    onClick={() => handleDeleteFullOption(index)}
                                                                >
                                                                    <button className='btn btn-outline-danger'>
                                                                        delete full option
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                        {
                                                            option?.values?.map((value, valueIndex) => (
                                                                <div key={valueIndex} className="row mt-3">
                                                                    <div className="col-lg-4">
                                                                        <input
                                                                            disabled={underUpdating === value?.id ? false : value?.id}
                                                                            type="text"
                                                                            placeholder="Option Name (e.g., 128 GB)"
                                                                            defaultValue={value?.name}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                updateOptionsValuesArray(index, valueIndex, 'name', value);
                                                                            }}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <input
                                                                            disabled={underUpdating === value?.id ? false : value?.id}
                                                                            type="text"
                                                                            placeholder="Price Impact"
                                                                            defaultValue={value?.price}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                updateOptionsValuesArray(index, valueIndex, 'price', value);
                                                                            }}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-3">
                                                                        {
                                                                            option?.attribute_id ?
                                                                                value?.isAdded ?
                                                                                    <button
                                                                                        type='button' onClick={() => handleAddValueToExistedOption(index, valueIndex)}
                                                                                        className='btn btn-outline-success'
                                                                                    >
                                                                                        <i className="bi bi-check-lg"></i>
                                                                                    </button>
                                                                                    :
                                                                                    <>
                                                                                        <button
                                                                                            type='button'
                                                                                            onClick={() => {
                                                                                                if (underUpdating === value?.id) {
                                                                                                    handleUpdateValueData(index, valueIndex);
                                                                                                } else {
                                                                                                    handleSetValueEnableToEdit(value?.id)
                                                                                                }
                                                                                            }}
                                                                                            className='btn btn-outline-success'
                                                                                        >
                                                                                            {
                                                                                                underUpdating === value?.id ?
                                                                                                    <i className="bi bi-check-lg"></i>
                                                                                                    :
                                                                                                    <i className="bi bi-pencil-square"></i>
                                                                                            }
                                                                                        </button>
                                                                                        <button
                                                                                            type='button'
                                                                                            onClick={() => handleDeleteOptionValueExisted(index, valueIndex)}
                                                                                            className='btn btn-outline-danger ms-2'
                                                                                        >
                                                                                            <i className="bi bi-trash"></i>
                                                                                        </button>
                                                                                    </>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                        <button type='button' onClick={() => {
                                                            handleAddValue(index)
                                                        }} className='btn btn-outline-success mt-2'>
                                                            add value
                                                        </button>
                                                    </div>
                                                    {
                                                        option?.newValue &&
                                                        <button type='button' onClick={() => {
                                                            handleAddNewOption(index);
                                                        }} className='btn btn-secondary mt-3'>
                                                            submit option
                                                        </button>
                                                    }
                                                </>
                                            ))}
                                            {
                                                newOptions?.length <= (currCatalog?.options?.length > 0 ? currCatalog?.options?.length : currService?.options?.length) &&
                                                (
                                                    <button type="button" onClick={handleAddOptionField} className="btn btn-secondary mt-4">
                                                        Add New Option Field
                                                    </button>
                                                )
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};