import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookAppointMentSchema } from '../../validation/BookAppointShema';
import './bookAppointMentFromStyle.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { Button, Modal } from 'react-bootstrap';

export default function BookAppointMentFrom({ show, handleClose, companyId, company, token }) {
    const [selectedAppointMent, setSelectedAppointMent] = useState({});
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            date: '',
            time: '',
            reason: '',
        },
        resolver: zodResolver(BookAppointMentSchema),
    });

    const submitHandler = async (data) => {
        data.company_id = companyId;
        const toastId = toast.loading('Loading...');
        console.log(data);
        await axios.post(`${baseURL}/user/book-appointment`, data, {
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                toast.success(res?.data?.message || 'Booked Successfully!', {
                    id: toastId,
                    duration: 1000
                });
                handleClose();
            })
            .catch(err => {
                if (err?.response?.data?.errors) {
                    Object.keys(err.response.data.errors).forEach((key) => {
                        setError(key, { message: err.response.data.errors[key][0] });
                    });
                };
                toast.error(err?.response.data?.message || 'Something Went Wrong!', {
                    id: toastId,
                    duration: 1000
                });
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='container'>
                <form onSubmit={handleSubmit(submitHandler)} className="row bookAppointMentForm">
                    <Modal.Header closeButton>
                        <Modal.Title>Book AppointMent</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className=' col-md-12 mb-4'>
                            <label htmlFor={`BookAppointMentDate`}>
                                Date - Day
                            </label>
                            <select
                                className={`form-select mt-2 w-100 ${errors?.date && 'inputError'}`}
                                id={`BookAppointMentDate`}
                                defaultValue={''}
                                onChange={(e) => {
                                    const selectedElement = company?.company?.appointments[e.target.value];
                                    setSelectedAppointMent(selectedElement);
                                    setValue('date', selectedElement?.date);
                                }}
                            >
                                <option disabled value="">Date - Day</option>
                                {
                                    company?.company?.appointments?.map((appointment, idx) => (
                                        <option key={idx} value={idx}>({appointment?.date}) - ({appointment?.day}) </option>
                                    ))
                                }
                            </select>
                            {
                                errors?.date?.message &&
                                <span className="errorMessage">{errors?.date?.message}</span>
                            }
                        </div>
                        <div className=' col-md-12 mb-4'>
                            <label htmlFor={`BookAppointMentDataAndTime`}>
                                Time
                            </label>
                            <select
                                className={`form-select mt-2 w-100 ${errors?.time && 'inputError'}`}
                                id={`BookAppointMentDataAndTime`}
                                defaultValue={''}
                                onChange={(e) => {
                                    const selectedSlot = selectedAppointMent?.slots?.[e.target.value];
                                    setValue('time', selectedSlot?.time);
                                }}
                            >
                                <option disabled value="">Time</option>
                                {
                                    selectedAppointMent?.slots?.map((slot, idx) => (
                                        (slot?.booked === false) &&
                                        <option key={idx} value={idx}>{slot?.time}</option>
                                    ))
                                }
                            </select>
                            {
                                errors?.time?.message &&
                                <span className="errorMessage ms-2">{errors?.time?.message}</span>
                            }
                        </div>
                        <div className="col-md-12 mb-4">
                            <label htmlFor="reasonForAppointMent">Reason</label>
                            <textarea
                                className={`form-control ${errors?.reason?.message ? 'inputError' : ''}`}
                                id="reasonForAppointMent"
                                placeholder='Type Your Reason'
                                {...register('reason')}
                            ></textarea>
                            {
                                errors?.reason?.message &&
                                <span className='errorMessage'>{errors?.reason?.message}</span>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-center'>
                        <Button variant="outline-danger" className='py-2' onClick={handleClose}>
                            Cancel
                        </Button>
                        <div className='d-inline'>
                            <input
                                className='contactCompany__form-submitBtn m-auto w-auto fs-5 fw-light px-2 py-1'
                                type='submit'
                                id="submitCompanyFormBtn"
                                name='submitCompanyFormBtn'
                                value={isSubmitting ? 'Sending ...' : 'Submit'}
                                disabled={isSubmitting}
                            />
                        </div>
                    </Modal.Footer>
                </form>
            </div>
        </Modal>

    );
};
