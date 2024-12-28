import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserVirificationSchema } from '../../validation/UserVirification';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function UserVirificationFormSec({ token }) {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0); // State to store timer value

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(UserVirificationSchema),
  });

  // const onSubmit = async (data) => {
  //   const toastId = toast.loading('Loading...');
  //   await axios
  //     .post(`${baseURL}/user/verify-account`, data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //     })
  //     .then((res) => {
  //       Cookies.set('verified', 'true', { expires: 365 });
  //       toast.success(res?.data?.message || 'Verified Successfully!', {
  //         id: toastId,
  //         duration: 1000,
  //       });
  //       navigate(`/profile/profile-settings`);
  //       toast.success('your account will be verified by our admin team ... within 7 days',{
  //         duration: 7000,
  //       })
  //     })
  //     .catch((err) => {
  //       toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
  //         id: toastId,
  //         duration: 1000,
  //       });
  //     });
  // };

  const onSubmit = async (data) => {
    const toastId = toast.loading('Loading...');
    await axios
      .post(`${baseURL}/user/verify-account`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then((res) => {
        Cookies.set('verified', 'true', { expires: 365 });
        toast.success(res?.data?.message || 'Verified Successfully!', {
          id: toastId,
          duration: 1000,
        });
        navigate(`/profile/profile-settings`);
        toast.success('Your account will be verified by our admin team within 7 days.', {
          duration: 7000,
        });
      })
      .catch((err) => {
        toast.dismiss(toastId);
  
        if (err?.response?.status === 422 && err?.response?.data?.errors) {
          // Display all error messages
          Object.entries(err.response.data.errors).forEach(([key, messages]) => {
            messages.forEach((message) => {
              toast.error(message, { duration: 3000 });
            });
          });
        } else {
          // Handle generic error
          toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
            duration: 3000,
          });
        }
      });
  };
  
  const handleResendCode = async () => {
    const toastId = toast.loading('Loading...');
    setIsButtonDisabled(true);
    await axios
      .post(
        `${baseURL}/user/resend-verify-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then((res) => {
        toast.success(res?.data?.message || 'Code sent successfully!', {
          id: toastId,
          duration: 1000,
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
          id: toastId,
          duration: 1000,
        });
      });
    setTimer(30);
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsButtonDisabled(false);
    };
    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className='signUpForm__mainSec py-5 mb-5'>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="signUpForm__mainContent">
              <div className="row">
                <h3 className="col-12 text-center py-5 signUpForm__head">
                  Verify Account
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className='row justify-content-center'>
                  <div className="col-lg-8 mb-4">
                    <label htmlFor="userVerificationInput">
                      Verification Code <span className="requiredStar">*</span>
                    </label>
                    <input
                      type='text'
                      id='userVerificationInput'
                      placeholder='123 456 789'
                      {...register('otp')}
                      className={`form-control signUpInput ${errors.otp ? 'inputError' : ''}`}
                    />
                    {errors.otp && (
                      <span className='errorMessage'>{errors.otp.message}</span>
                    )}
                  </div>
                  <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                    <input
                      disabled={isSubmitting}
                      type="submit"
                      value={'Verify'}
                    />
                    <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                      <button
                        onClick={handleResendCode}
                        type="button"
                        className={`prevStep__btn ${isButtonDisabled && 'disabledBtn'}`}
                        disabled={isButtonDisabled}
                      >
                        {isButtonDisabled ? `Resend Code (${timer}s)` : 'Resend Code'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
