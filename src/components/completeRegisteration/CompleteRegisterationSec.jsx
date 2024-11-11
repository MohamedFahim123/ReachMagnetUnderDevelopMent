import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompleteRegisterationSchema } from '../../validation/CompleteRegisteration';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import Cookies from 'js-cookie';
import { scrollToTop } from '../../functions/scrollToTop';

export default function CompleteRegisterationSec() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            email: '',
            phone: ''
        },
        resolver: zodResolver(CompleteRegisterationSchema),
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading('Loading...');
        await axios.post(`${baseURL}/company-complete-register`,data,{
            headers:{
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
        .then(res => {
            Cookies.set('currentStep',res?.data?.data?.form_number);
            Cookies.set('companyRegId',res?.data?.data?.company_id);
            toast.success(res?.data?.message || 'Data Restored Successfully!',{
                id: toastId,
                duration: 1000
            });
            navigate('/business-signUp');
            scrollToTop();
            reset();
        })
        .catch(err=>{
            Object.keys(err?.response?.data?.errors).forEach((key) => {
                setError(key, { message: err?.response?.data?.errors[key][0] });
            });
            toast.error(err?.response?.data?.message || 'Something Went Wrong!',{
                id: toastId,
                duration: 1000
            });
        })
    };
    console.log(Cookies.get('companyRegId'))
    console.log(Cookies.get('currentStep'))

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <ul className='row loginToggler'>
                            <li className={`col-md-3 cursorPointer`} onClick={() => navigate('/personalsignUp')}>
                                User
                            </li>
                            <li className={`col-md-3 cursorPointer active`} onClick={() => navigate('/business-signUp')}>
                                Business
                            </li>
                        </ul>
                        <div className="signUpForm__mainContent">
                            <div className="row">
                                <h3 className="col-12 text-center py-5 signUpForm__head">
                                    Complete Registeration
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row'>

                                    <div className="col-lg-7 mb-4 mx-auto">
                                        <label htmlFor="completeRegisteremail">
                                            E-mail Address <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='completeRegisteremail'
                                            placeholder='ex: admin@gmail.com'
                                            {...register('email')}
                                            className={`form-control signUpInput ${errors.email ? 'inputError' : ''}`}
                                        />
                                        {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-7 mb-4 mx-auto">
                                        <label htmlFor="completeRegisterationPhone">
                                            Company's Phone
                                            <span className="requiredStar"> *</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='completeRegisterationPhone'
                                            placeholder="Company's Phone"
                                            {...register('phone')}
                                            className={`form-control signUpInput ${errors.phone ? 'inputError' : ''}`}
                                        />
                                        {
                                            errors.phone
                                            &&
                                            (<span className='errorMessage'>{errors.phone.message}</span>)
                                        }
                                    </div>

                                    <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                                        <input disabled={isSubmitting} type="submit" value={'Restore Register Data'} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
