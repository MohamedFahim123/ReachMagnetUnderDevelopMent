import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { ResetPasswordStep2Schema } from '../../validation/ResetPasswordStep2Schema';

export default function ResetPasswordForm() {
    const loginType = localStorage.getItem('loginType');
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState:{errors , isSubmitting}
    } = useForm({
        defaultValues: {
            email: '',
            otp: '',
            new_password: '',
            new_password_confirmation: '',
        },
        resolver: zodResolver(ResetPasswordStep2Schema),
    });

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/${loginType}/reset-password`, data, {
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
            navigate('/login');
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
                                    Reset your password
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordStep2Email">
                                            E-mail Address <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='resetPasswordStep2Email'
                                            placeholder='Enter your existing email'
                                            {...register('email')}
                                            className={`form-control signUpInput ${errors.email && 'inputError'}`}
                                        />
                                        {
                                            errors.email
                                            &&
                                            (<span className='errorMessage'>{errors.email.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordOTP">
                                            OTP <span className="requiredStar">*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='resetPasswordOTP'
                                            placeholder='Enter OTP'
                                            {...register('otp')}
                                            className={`form-control signUpInput ${errors.otp && 'inputError'}`}
                                        />
                                        {
                                            errors.otp
                                            &&
                                            (<span className='errorMessage'>{errors.otp.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="resetPasswordNewPassword">
                                            New Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={`${showPassword ? 'text' : 'password'}`}
                                                id='resetPasswordNewPassword'
                                                placeholder='Enter 8-digit password'
                                                {...register('new_password')}
                                                className={`form-control signUpInput ${errors?.new_password && 'inputError'}`}
                                            />
                                            <div className="leftShowPasssord" onClick={()=>setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div>
                                        </div>
                                        {
                                            errors.new_password
                                            &&
                                            (<span className='errorMessage'>{errors.new_password.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            Confirm Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={`${showConfirmPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder='Enter 8-digit password'
                                                {...register('new_password_confirmation')}
                                                className={`form-control signUpInput ${errors?.new_password_confirmation && 'inputError'}`}
                                            />
                                            <div className="leftShowPasssord" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                                            {
                                                showConfirmPassword ?
                                                <i className="bi bi-eye-slash"></i>
                                                :
                                                <i className="bi bi-eye-fill"></i>
                                            }
                                            </div>
                                        </div>
                                        {
                                            errors.new_password_confirmation
                                            &&
                                            (<span className='errorMessage'>{errors.new_password_confirmation.message}</span>)
                                        }
                                    </div>
                                    <div className="col-lg-12 text-center mt-3 signUp__submitBtn">
                                        <input
                                            disabled={isSubmitting}
                                            type="submit"
                                            value={'Confirm Changes'}
                                        />
                                    </div>
                                    <div className="col-12 text-dark text-center">
                                        <NavLink className="gotoLoginLink ms-2" to="/forget-password">
                                            Send Message Again
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
