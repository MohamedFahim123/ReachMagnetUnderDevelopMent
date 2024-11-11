import React, { useState } from 'react';
import './signInFormMain.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../../validation/LoginSchema';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate , NavLink } from 'react-router-dom';

export default function SignInFormMainSec({loginType,setLoginType,fcmToken}) {
    const navigate = useNavigate();
    const [showPassword,setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState:{errors , isSubmitting}
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(LoginSchema),
    });

    const handleChangeLoginType = (type) => {
        localStorage.setItem('loginType',type);
        setLoginType(localStorage.getItem('loginType'));
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        await axios.post(`${baseURL}/${loginType}/login?t=${new Date().getTime()}`, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // 'fcm_token' : fcmToken
            },
        }).then(response => {
            const token = response?.data?.data?.token;
            if (token) {
                Cookies.set('authToken', token, { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });
                const slugCompletion = loginType === 'user' ? 'user/profile' : 'employee/show-profile';
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${baseURL}/${slugCompletion}?t=${new Date().getTime()}`, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                        });
                        loginType === 'employee' ?
                            Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                        :
                            Cookies.set('currentLoginedData', JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                    } catch (error) {
                        toast.error(`${JSON.stringify(error?.response?.data?.message)}`);
                    };
                };
                fetchData();
            };
            toast.success(`${response?.data?.message}.`,{
                id: toastId,
                duration: 1000
            });
            if( loginType === 'user' && !response?.data?.data?.user?.verified){
                setTimeout(() => {
                    navigate('/user-verification');
                },1000);
            }else {
                setTimeout(() => {
                    navigate('/');
                window.location.reload();
                },1000);
            };
            reset();
        })
        .catch(error => {
            if (error?.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach((key) => {
                    setError(key, { message: error.response.data.errors[key][0] });
                });
            };
            toast.error(error?.response?.data?.message?.password ||error?.response?.data?.message,{
                id: toastId,
                duration: 2000,
            });
        });
    };

    return (
        <div className='signUpForm__mainSec py-5 mb-5'>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <ul className='row loginToggler'>
                            <li className={`col-md-3 cursorPointer ${loginType === 'user' && 'active'}`} onClick={()=>handleChangeLoginType('user')}>
                                User
                            </li>
                            <li className={`col-md-3 cursorPointer ${loginType === 'employee' && 'active'}`} onClick={()=>handleChangeLoginType('employee')}>
                                Business
                            </li>
                        </ul>
                        <div className="signUpForm__mainContent">
                            <div className="row">
                                <h3 className="col-12 text-center pt-5 signUpForm__head">
                                    {loginType === 'user' ? 'User Login' : 'Login as a Business' } 
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInEmailAddress">
                                            E-mail Address <span className="requiredStar">*</span>
                                        </label>
                                        <input 
                                            type='text'
                                            id='signInEmailAddress'
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
                                    <div className="col-lg-8 mb-4">
                                        <label htmlFor="signInPassword">
                                            Password <span className="requiredStar">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input 
                                                type={`${showPassword ? 'text' : 'password'}`}
                                                id='signInPassword'
                                                placeholder='Enter 8-digit password'
                                                {...register('password')}
                                                className={`form-control signUpInput ${errors.password ? 'inputError' : ''}`}
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
                                                errors.password
                                                &&
                                                (<span className='errorMessage'>{errors.password.message}</span>)
                                            }
                                    </div>
                                    <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                                        <input
                                            disabled={isSubmitting}
                                            type="submit"
                                            value={'Login'} 
                                        />
                                        {
                                        loginType === 'user' &&
                                            <div className="resetPasswordNavigatinoLink text-end">
                                                <NavLink className='gotoLoginLink' to='/forget-password'>Forget Password ?</NavLink>
                                            </div>
                                        }
                                    </div>
                                    
                                    <div className="col-12 text-dark text-center">
                                        <span>Don't Have and account?</span>
                                        <NavLink className="gotoLoginLink ms-2" to="/personalsignUp">
                                            Create New Account
                                        </NavLink>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
