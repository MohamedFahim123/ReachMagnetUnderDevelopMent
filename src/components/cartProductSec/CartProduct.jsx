import React, { useState } from 'react';
import './cartProduct.css';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function CartProduct({
    title,
    description,
    notes,
    imageSrc,
    showImage = true,
    showFiles = false,
    fileList = [],
    cartId,
    quantity,
    companyIdWantedToHaveQuoteWith,
    setCart,
    token,
    options
}) {
    const [counter, setCounter] = useState(quantity);
    const [note, setNote] = useState('');
    const [currNotes, setCurrNotes] = useState(notes === 'N/A' ? '' : notes);

    const [selectedOptions, setSelectedOptions] = useState(() => {
        const initialOptions = {};
        options?.forEach((option) => {
            const chosenValue = option.values.find((value) => value.chosen);
            if (chosenValue) {
                initialOptions[option.attribute_id] = chosenValue.id;
            }
        });
        return initialOptions;
    });

    const handleRemoveProduct = (id) => {
        if (companyIdWantedToHaveQuoteWith) {
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/delete-item-from-quotation-cart/${companyIdWantedToHaveQuoteWith}`,
                    {
                        quotation_cart_id: `${id}`,
                    }
                    , {
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data?.cart);
                        toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
            })();

        } else {
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/delete-item-from-one-click-quotation-cart?t=${new Date().getTime()}`,
                    {
                        one_click_quotation_cart_id: `${id}`,
                    }
                    , {
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data);
                        toast.success(`${response?.data?.message || 'Added Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
            })();
        };
    };

    const handleDecreaseOrIncrease = (id, type) => {
        if (type === 'increase') {
            setCounter(prevCounter => prevCounter + 1);
        } else if (type === 'decrease' && counter > 0) {
            setCounter(prevCounter => prevCounter - 1);
        };
        if (companyIdWantedToHaveQuoteWith) {
            (async () => {
                await axios.post(`${baseURL}/user/control-quantity-for-quotation-cart/${companyIdWantedToHaveQuoteWith}`,
                    {
                        quotation_cart_id: `${id}`,
                        quantity_type: `${type}`,
                    }
                    , {
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data?.cart);
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.error?.quantity[0] || error?.response?.data?.message || 'Error!'}`, {
                            duration: 1000
                        });
                    })
            })();

        } else {
            (async () => {
                await axios.post(`${baseURL}/user/control-quantity-for-one-click-quotation-cart?t=${new Date().getTime()}`,
                    {
                        one_click_quotation_cart_id: `${id}`,
                        quantity_type: `${type}`,
                    }
                    , {
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data);
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.message || 'Error!'}`, {
                            duration: 1000
                        });
                    })
            })();
        };
    };

    const handleAddNoteToQuotation = (id) => {
        if (companyIdWantedToHaveQuoteWith) {
            const value = {
                quotation_cart_id: id,
                note: note,
            };
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/add-note-to-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                    value
                    , {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCurrNotes(response?.data?.data?.cart?.find(el => el.quotation_cart_id === cartId)?.note);
                        toast.success(`${response?.data?.message || 'Note Added Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.errors?.note[0] || error?.response?.data?.message || 'Error Adding Note!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    });
            })();

        } else {
            const value = {
                one_click_quotation_cart_id: id,
                note: note,
            };
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/add-note-to-one-click-quotation-cart?t=${new Date().getTime()}`,
                    value
                    , {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data);
                        setCurrNotes(response?.data?.data?.one_click_quotation_cart[0]?.note);
                        toast.success(`${response?.data?.message || 'Note Added Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.errors?.one_click_quotation_cart_id || error?.response?.data?.message || 'Error Adding Note!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    });
            })();
        }
    };

    const handleDeleteNoteFromQuotation = (id) => {
        if (companyIdWantedToHaveQuoteWith) {
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/remove-note-from-quotation-cart/${companyIdWantedToHaveQuoteWith}?t=${new Date().getTime()}`,
                    {
                        quotation_cart_id: id,
                    }
                    , {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data?.cart);
                        setCurrNotes('');
                        toast.success(`${response?.data?.message || 'Note Removed Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.errors?.note || error?.response?.data?.message || 'Error Removing Note!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    });
            })();
        } else {
            (async () => {
                const toastId = toast.loading('Loading...');
                await axios.post(`${baseURL}/user/remove-note-from-one-click-quotation-cart?t=${new Date().getTime()}`,
                    {
                        one_click_quotation_cart_id: id,
                    }
                    , {
                        headers: {
                            'Content-type': 'multipart/form-data',
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        setCart(response?.data?.data);
                        setNote('');
                        setCurrNotes('');
                        toast.success(`${response?.data?.message || 'Note Removed Successfully!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    })
                    .catch(error => {
                        toast.error(`${error?.response?.data?.errors?.note || error?.response?.data?.message || 'Error Removing Note!'}`, {
                            id: toastId,
                            duration: 1000
                        });
                    });
            })();
        }
    };
    const handleAddOptionToCart = (cartId, attributeId, optionId) => {
        const requestBody = {
            quotation_cart_id: `${cartId}`,
            prefrence_attribute_id: `${attributeId}`,
            prefrence_option_id: `${optionId}`,
            type: 'add'
        };

        // Send the API request
        (async () => {
            const toastId = toast.loading('Adding option...');
            try {
                const response = await axios.post(`${baseURL}/user/control-preference-in-quotation-cart/${companyIdWantedToHaveQuoteWith}`, requestBody, {
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                setCart(response?.data?.data?.cart); // Update the cart state
                toast.success('Option added successfully!', {
                    id: toastId,
                    duration: 1000
                });
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Error adding option!', {
                    id: toastId,
                    duration: 1000
                });
            }
        })();
    };

    return (
        <div className="selected__product__item" >
            <div className="selected__product__info">
                {(showImage || showFiles) &&
                    (<div>
                        {showImage && imageSrc && (
                            <div className="prod__img">
                                <img src={imageSrc} alt={title} />
                            </div>
                        )}

                        {showFiles && fileList.length > 0 && (
                            <div style={{
                                background: 'rgba(6, 127, 173, .7)',
                                padding: '8px',
                                borderRadius: '8px',
                                color: '#fff',
                                width: '158px',
                                height: '151px',
                                textTransform: 'capitalize',
                                marginTop: '10px',
                            }} className="file__attachments">
                                <h5>Attached Files:</h5>
                                <ul>
                                    {fileList.map((file, index) => (
                                        <li key={index}>
                                            <NavLink to={file.media} target="_blank" rel="noopener noreferrer" className={'nav-link'}>
                                                {file.name || `File ${index + 1}`}
                                                <i className="bi bi-box-arrow-up-right ms-2"></i>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    )}

                {!showImage && !showFiles && (
                    <div
                        style={{
                            background: 'rgba(145, 151, 179, .7)',
                            padding: '8px',
                            borderRadius: '8px',
                            color: '#fff',
                            width: '158px',
                            height: '151px',
                            textTransform: 'capitalize',
                        }}
                        className="d-flex align-items-center file__attachments"
                    >
                        <p>No Attachments Added</p>
                    </div>
                )}
                <div className="prod__text">
                    <h3>{title}</h3>
                    {description && (
                        <div>
                            <strong>Description:</strong>
                            <p>{description}</p>
                        </div>
                    )}
                    {
                        (currNotes) ?
                            <div className='d-flex align-items-center gap-2'>
                                <textarea className=' mt-2 form-control bg-transparent p-2 w-75' rows={3} value={currNotes} disabled></textarea>
                                <i onClick={() => handleDeleteNoteFromQuotation(cartId)} className="bi bi-trash-fill cursorPointer "></i>
                            </div>
                            :
                            <>
                                <div className='addNotes mt-2'>
                                    <textarea
                                        placeholder='Add Note...'
                                        name=""
                                        value={note}
                                        id='companyQuotationNote'
                                        className='form-control w-75 mb-3'
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={3}
                                    >
                                    </textarea>
                                </div>
                                <span onClick={() => handleAddNoteToQuotation(cartId)} className='pageMainBtnStyle'>Add Note</span>
                            </>
                    }
                    {
                        options?.length !== 0 &&
                        <>
                            <strong className='d-block mt-3 mb-2 text-capitalize'>
                                options:
                            </strong>
                            {
                                options?.map((option, index) => (
                                    <div key={index} className='mb-3'>
                                        <p className=' text-capitalize'>
                                            choose a {option?.attribute}
                                        </p>
                                        <div className='d-flex align-items-center gap-2'>
                                            {
                                                option?.values?.map((value, index) => (
                                                    <div style={{
                                                        backgroundColor: 'rgba(211, 212, 219, 0.5)', padding: '4px', borderRadius: '5px',
                                                    }} key={index} className='mt-2 d-flex gap-2 align-items-center'>
                                                        <input
                                                            className='form-check cursorPointer'
                                                            type="radio"
                                                            id={`option-${value.id}`}
                                                            name={`option-${option.attribute_id}`}
                                                            value={value.id}
                                                            checked={selectedOptions[option.attribute_id] === value.id}
                                                            onChange={() => {
                                                                setSelectedOptions((prev) => ({
                                                                    ...prev,
                                                                    [option.attribute_id]: value.id,
                                                                }));
                                                                handleAddOptionToCart(cartId, option.attribute_id, value.id);
                                                            }}
                                                        />
                                                        <label className='text-capitalize' htmlFor={`option-${value.id}`}>{value.name}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    }
                </div>
            </div>
            <div className="selected__product__action">
                <div className="delete__btn" onClick={() => handleRemoveProduct(cartId)}>
                    <i className="bi bi-trash-fill"></i>
                </div>
                <div className="quantity__btns">
                    <p className='decreaseBtn' onClick={() => handleDecreaseOrIncrease(cartId, 'decrease')}>-</p>
                    <span>{counter}</span>
                    <p className='increaseBtn' onClick={() => handleDecreaseOrIncrease(cartId, 'increase')}>+</p>
                </div>
            </div>
        </div>
    )
}
