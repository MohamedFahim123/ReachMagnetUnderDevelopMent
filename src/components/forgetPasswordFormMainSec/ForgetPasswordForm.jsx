import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom'
import { ResetPasswordStep1Schema } from '../../validation/ResetPasswordStep1Schema';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
export default function ForgetPasswordForm() {
    const loginType = localStorage.getItem('loginType');
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState:{errors , isSubmitting}
    } = useForm({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(ResetPasswordStep1Schema),
    });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/${loginType}/forget-password`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            toast.success(`${response?.data?.message}.`,{
                id: toastId,
                duration: 1000
            });
            reset();
            navigate('/reset-password')
        }).catch(error => {
            Object.keys(error?.response?.data?.errors).forEach((key) => {
                setError(key, {message: error?.response?.data?.errors[key][0]});
            });
            toast.error(error?.response?.data?.message,{
                id: toastId,
                duration: 2000
            });
        });
    };

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className='signUpForm__mainContent'>
                        <div className='row'>
                            <h3 className="col-12 text-center pt-5 signUpForm__head">
                                Forget your password
                            </h3>
                            <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                                <div className="col-lg-8 my-5">
                                    <label htmlFor="forgetPasswordEmailAddress">
                                        E-mail Address <span className="requiredStar">*</span>
                                    </label>
                                    <input
                                        type='text'
                                        id='forgetPasswordEmailAddress'
                                        placeholder='Enter your existing email'
                                        {...register('email')}
                                        className={`form-control signUpInput ${errors?.email?.message && 'inputError'}`}
                                    />
                                    {
                                        errors.email
                                        &&
                                        (<span className='errorMessage'>{errors.email.message}</span>)
                                    }
                                </div>
                                <div className="col-lg-12 text-center mt-3 signUp__submitBtn">
                                    <input
                                        disabled={isSubmitting}
                                        type="submit"
                                        value={'Reset Password'}
                                    />
                                </div>
                                <div className="col-12 text-dark text-center">
                                    <span>Back To</span>
                                    <NavLink className="gotoLoginLink ms-2" to="/Login">
                                        Login
                                    </NavLink>
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
