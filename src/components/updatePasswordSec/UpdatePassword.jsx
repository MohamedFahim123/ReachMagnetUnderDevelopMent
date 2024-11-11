import React, { useState } from 'react';
import { UpdatePasswordSchema } from '../../validation/UpdatePassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function UpdatePassword({token}) {
  const [showCurrentPassword,setShowCurrentPassword] = useState(false);
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const loginType = localStorage.getItem('loginType');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState:{errors , isSubmitting}
} = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
    resolver: zodResolver(UpdatePasswordSchema),
});

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    await axios.post(`${baseURL}/${loginType}/update-password`, data, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    }).then(response => {
      toast.success(`${response?.data?.message}.`,{
        id: toastId,
        duration: 1000,
      });
      localStorage.setItem('updatingData','profile');
      reset();
    }).catch(error => {
      if(error?.response?.data?.errors){
        Object.keys(error?.response?.data?.errors).forEach((key) => {
          setError(key, {message: error?.response?.data?.errors[key][0]});
        });
      }
      toast.error(error?.response?.data?.message,{
        id: toastId,
        duration: 2000
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='row my-5'>
      <div className="col-lg-8 mb-4 m-auto">
        <label htmlFor="profilecurrent_password">
            Current Password
        </label>
        <div className="position-relative">
            <input 
                type={`${showCurrentPassword ? 'text' : 'password'}`}
                id='profilecurrent_password'
                placeholder='Enter Your Current Password'
                {...register('current_password')}
                className={`form-control signUpInput ${errors.current_password ? 'inputError' : ''}`}
            />
            <div className="leftShowPasssord" onClick={()=>setShowCurrentPassword(!showCurrentPassword)}>
            {
                showCurrentPassword ?
                <i className="bi bi-eye-slash"></i>
                :
                <i className="bi bi-eye-fill"></i>
            }
            </div>
        </div>
            {
                errors.current_password
                &&
                (<span className='errorMessage'>{errors.current_password.message}</span>)
            }
      </div>
      <div className="col-lg-8 mb-4 m-auto">
        <label htmlFor="profilenew_password">
            New Password 
        </label>
        <div className="position-relative">
            <input 
                type={`${showPassword ? 'text' : 'password'}`}
                id='profilenew_password'
                placeholder='Enter New Password'
                {...register('new_password')}
                className={`form-control signUpInput ${errors.new_password ? 'inputError' : ''}`}
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
      <div className="col-lg-8 mb-4 m-auto">
        <label htmlFor="profilenew_password_confirmation">
            Password <span className="requiredStar">*</span>
        </label>
        <div className="position-relative">
            <input 
                type={`${showConfirmPassword ? 'text' : 'password'}`}
                id='profilenew_password_confirmation'
                placeholder='Enter 8-digit password'
                {...register('new_password_confirmation')}
                className={`form-control signUpInput ${errors.new_password_confirmation ? 'inputError' : ''}`}
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
      <div className="col-lg-12 text-center">
        <input type="submit" disabled={isSubmitting} value="Confirm Changes" className='updateBtn' />
      </div>
    </form>
  )
}
