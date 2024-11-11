import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { UpdateEmployeeProfileSchema } from '../../validation/UpdateEmployeeProfile';
import { useForm } from 'react-hook-form';
import { scrollToTop } from '../../functions/scrollToTop';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import defaultImage from '../../assets/images.png';

export default function CompanyDashboardProfileForm({token,currentUserLogin,setProfileUpdateStatus,profileUpdateStatus,countries}) {
    const currentChosenCountry = countries?.find(el => el?.name === currentUserLogin?.country );
    const [currentCities,setCurrentCities] = useState([]);
    const [defaultChosenCity,setDefaultChosenCity] = useState(null);
    const [imgChanged,setImageChanged] = useState(false);
    const [currentImage,setCurrentImage] = useState(currentUserLogin?.image);
    const loginType =localStorage.getItem('loginType');
    const loginTypeEmployeeCondition =  loginType=== 'employee';
    const citiesInsideCurrentCountry = async (chosenCountry) => {
        try {
            const response = await axios.get(`${baseURL}/countries/${chosenCountry?.code}`);
            const cities = response?.data?.data?.cities || [];
            setCurrentCities(cities);
            const defaultCity = currentCities.find(city => city?.cityName === currentUserLogin?.city);
            setDefaultChosenCity(defaultCity?.cityId || null);
        } catch(error){
            toast.error(`${error?.response?.data?.message || error?.message}`);
        };
    };

    const {
        register,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors , isSubmitting}
    } = useForm({
        defaultValues: {
            name: currentUserLogin?.name,
            email: currentUserLogin?.email,
            phone: currentUserLogin?.phone,
            citizenship: currentUserLogin?.citizenship,
            official_id_or_passport: '',
            image: "",
            country_id: currentChosenCountry?.id,
            city_id: '',
            full_address: currentUserLogin?.fullAddress,
            address_one: '',
            address_two: '',
        },
        resolver: zodResolver(UpdateEmployeeProfileSchema),
    });

    useEffect(() => {
        const savedData = Cookies.get('currentLoginedData');
        console.log(savedData)
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            loginTypeEmployeeCondition ?
            (
                Object.keys(parsedData).forEach(async key => {
                    if (key === 'fullAddress') {
                        setValue('full_address', parsedData[key]);
                    } else if (key === 'city') {
                        setValue('city_id', parsedData[key]);
                    } else if(key !== 'country' && key !== 'officialIdOrPassport' && key !== 'image' ){
                        setValue(key, parsedData[key]);
                    };
                })
            )
            :
                (
                    Object.keys(parsedData).forEach(async key => {
                    if (key === 'addressOne') {
                        setValue('address_one', parsedData[key]);
                    } else if (key === 'addressTwo') {
                        setValue('address_two', parsedData[key]);
                    } else if (key === 'city') {
                        setValue('city_id', parsedData[key]);
                    } else if(key !== 'country' && key !== 'officialIdOrPassport' && key !== 'image' ){
                        setValue(key, parsedData[key]);
                    };
                })
            )

            setCurrentImage(parsedData?.image);
        };
    }, []);

    useEffect(() => {
        if (currentChosenCountry) {
            citiesInsideCurrentCountry(currentChosenCountry);
        };
        if (defaultChosenCity) {
            setValue('city_id', defaultChosenCity);
        };
    }, [currentChosenCountry,defaultChosenCity]);

    useEffect(()=>{
        const currentChangedCountry = countries?.find(el => el?.id === +watch('country_id'));
        if(currentChangedCountry){
            citiesInsideCurrentCountry(currentChangedCountry);
            setValue('city_id','');
        };
    },[watch('country_id')]);

    const hangleChangeImage = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const newFileUrl = URL.createObjectURL(selectedFile);
            setCurrentImage(newFileUrl);
            setImageChanged(true);
        }
        setValue('image',event.target.files);
    };

    const onSubmit = async (data) => {
        const toastId = toast.loading('Please Wait...');
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key !== 'image' && key !== 'official_id_or_passport') {
                formData.append(key, data[key]);
            };
        });
        if(imgChanged && data.image[0]){
            formData.append('image', data.image[0]);
        };
        await axios.post(`${baseURL}/${loginType}/update-profile`, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
            }).then(response => {
                toast.success(`${response?.data?.message}.`,{
                    id: toastId,
                    duration: 1000,
                });
                loginType === 'employee' ?
                    Cookies.set('currentLoginedData',JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })
                :
                    Cookies.set('currentLoginedData',JSON.stringify(response?.data?.data?.user), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 })

                localStorage.setItem('updatingProfile','notUpdating');
                window.location.reload();
            })
            .catch(error => {
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
        <form className='row' onSubmit={handleSubmit(onSubmit)}>
            {
                loginTypeEmployeeCondition &&
                <div className="col-12 fs-2 fw-boldx text-center mb-3 text-capitalize">{currentUserLogin?.role} of {currentUserLogin?.companyName} Company</div>
            }
            <div className="col-lg-6 mt-2">
                <label htmlFor="dashboardEmployeeName">Full Name</label>
                <input
                    id='dashboardEmployeeName'
                    className={`form-control signUpInput mt-2 ${errors?.name ? 'inputError' : ''}`}
                    {...register('name')}
                    type="text"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.name
                    &&
                    (<span className='errorMessage'>{errors?.name?.message}</span>)
                }
            </div>
            <div className="col-lg-6 text-end mt-2">
                <img className='employeeImage' src={currentImage || defaultImage} alt={`employee ${watch('name')}`} />
            </div>
            <div className="col-lg-6 mt-4">
                <label htmlFor="dashboardEmployeeEmail">Email</label>
                <input
                    id='dashboardEmployeeEmail'
                    className={`form-control signUpInput mt-2 ${errors?.email ? 'inputError' : ''}`}
                    {...register('email')}
                    type="text"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.email
                    &&
                    (<span className='errorMessage'>{errors?.email?.message}</span>)
                }
            </div>
            <div className="col-lg-6 mt-4">
                <label htmlFor="dashboardEmployeePhone">Phone</label>
                <input
                    id='dashboardEmployeePhone'
                    className={`form-control signUpInput mt-2 ${errors?.phone ? 'inputError' : ''}`}
                    {...register('phone')}
                    type="number"
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.phone
                    &&
                    (<span className='errorMessage'>{errors?.phone?.message}</span>)
                }
            </div>
            {
                loginTypeEmployeeCondition
                &&
                <div className="col-lg-6 mt-4">
                    <label htmlFor="dashboardEmployeecitizenship">Citizenship</label>
                    <input
                        id='dashboardEmployeecitizenship'
                        className={`form-control signUpInput mt-2 ${errors?.citizenship ? 'inputError' : ''}`}
                        {...register('citizenship')}
                        type="text"
                        disabled={profileUpdateStatus === 'notUpdating'}
                    />
                    {
                        errors?.citizenship
                        &&
                        (<span className='errorMessage'>{errors?.citizenship?.message}</span>)
                    }
                </div>
            }
            <div className="col-lg-6 mt-4">
                <label htmlFor="dashboardEmployeeCountry">Country</label>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <input
                            id='dashboardEmployeeCountry'
                            className='form-control signUpInput mt-2'
                            value={currentUserLogin?.country}
                            type="text"
                            disabled={true}
                        />
                        :
                        <>
                        <select
                            className={`form-select signUpInput mt-2 ${errors?.country_id ? 'inputError' : ''}`}
                            defaultValue={currentChosenCountry?.id}
                            {...register('country_id')}
                            id="dashboardEmployeeCountry"
                        >
                            <option disabled value="">Select Your Country</option>
                            {
                                countries?.map(country => (
                                    <option key={country?.id} value={country?.id}>{country?.name}</option>
                                ))
                            }
                        </select>
                        {
                            errors?.country_id
                            &&
                            (<span className='errorMessage'>{errors?.country_id?.message}</span>)
                        }
                        </>
                }
            </div>
            <div className="col-lg-6 mt-4">
                <label htmlFor="dashboardEmployeeCity">City</label>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <input
                            id='dashboardEmployeeCity'
                            className='form-control signUpInput mt-2'
                            value={currentUserLogin?.city}
                            type="text"
                            disabled={true}
                        />
                        :
                        <>
                        <select
                            className={`form-select signUpInput mt-2 ${errors?.city_id ? 'inputError' : ''}`}
                            {...register('city_id')}
                            id="dashboardEmployeeCity"
                        >
                            <option disabled value="">Select Your city</option>
                            {
                                currentCities?.map(city => (
                                    <option key={city?.cityId} value={city?.cityId}>{city?.cityName}</option>
                                ))
                            }
                        </select>
                        {
                            errors?.city_id
                            &&
                            (<span className='errorMessage'>{errors?.city_id?.message}</span>)
                        }
                        </>
                }
            </div>
            {
                loginTypeEmployeeCondition &&
                <div className="col-lg-6 mt-4">
                    <label htmlFor="dashboardEmployeefullAddress">Full Address</label>
                    <input
                        id='dashboardEmployeefullAddress'
                        className={`form-control signUpInput mt-2 ${errors?.full_address ? 'inputError' : ''}`}
                        {...register('full_address')}
                        type="text"
                        disabled={profileUpdateStatus === 'notUpdating'}
                    />
                    {
                        errors?.full_address
                        &&
                        (<span className='errorMessage'>{errors?.full_address?.message}</span>)
                    }
                </div>
            }
            {
                !loginTypeEmployeeCondition &&
                <div className="col-lg-6 mt-4">
                    <label htmlFor="dashboardAddress_one">Address One</label>
                    <input
                        id='dashboardAddress_one'
                        className={`form-control signUpInput mt-2 ${errors?.address_one ? 'inputError' : ''}`}
                        {...register('address_one')}
                        type="text"
                        disabled={profileUpdateStatus === 'notUpdating'}
                    />
                    {
                        errors?.address_one
                        &&
                        (<span className='errorMessage'>{errors?.address_one?.message}</span>)
                    }
                </div>
            }
            {
                !loginTypeEmployeeCondition &&
                <div className="col-lg-6 mt-4">
                    <label htmlFor="dashboardAddress_two">Address Two</label>
                    <input
                        id='dashboardAddress_two'
                        className={`form-control signUpInput mt-2 ${errors?.address_two ? 'inputError' : ''}`}
                        {...register('address_two')}
                        type="text"
                        disabled={profileUpdateStatus === 'notUpdating'}
                    />
                    {
                        errors?.address_two
                        &&
                        (<span className='errorMessage'>{errors?.address_two?.message}</span>)
                    }
                </div>
            }
            <div className={`col-lg-12 mt-4 text-center ${profileUpdateStatus === 'notUpdating' ? 'd-none' : ''}`}>
                <label className='singUp__upLoadBtn' htmlFor="dashboardEmployeeImage">Profile Image</label>
                <input
                    id='dashboardEmployeeImage'
                    className='signUpInput'
                    type="file"
                    onChange={hangleChangeImage}
                    disabled={profileUpdateStatus === 'notUpdating'}
                />
                {
                    errors?.image
                    &&
                    (<span className='errorMessage'>{errors?.image?.message}</span>)
                }
            </div>
            <div className={`bottomContainer pt-5 ${(profileUpdateStatus === 'notUpdating') && 'mt-4'} text-center`}>
                {
                    (profileUpdateStatus === 'notUpdating') ?
                        <span className='startUpdateBtn' onClick={() => {
                            scrollToTop();
                            localStorage.setItem('updatingProfile', 'updating');
                            setProfileUpdateStatus(localStorage.getItem('updatingProfile'));
                        }}>Update Profile</span>
                        :
                        <input type="submit" disabled={isSubmitting} value="Confirm Changes" className='updateBtn' />
                }
            </div>
        </form>
    );
};