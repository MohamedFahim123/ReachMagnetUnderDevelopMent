import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessRegisterSchema } from '../../validation/BusinessRegisterSchema';
import BusinessSignUpPackages from '../businessSignUpPackages/BusinessSignUpPackages';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { scrollToTop } from '../../functions/scrollToTop';
import MyLoader from '../myLoaderSec/MyLoader';
import Cookies from 'js-cookie';
import CustomDropdown from '../customeDropdownSelectSec/CustomeDropdownSelect';

let allTypes = [
  {
    id: 1,
    name: 'Selling Physical Products',
  },
  {
    id: 2,
    name: 'Manufacturing Products',
  },
  {
    id: 3,
    name: 'Selling Digital Products',
  },
  {
    id: 4,
    name: 'Service Provider',
  },
  {
    id: 5,
    name: 'Raw Material Supplier',
  },
  {
    id: 6,
    name: 'Company Offers Customizations',
  },
];

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ setLocation, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.setView(initialPosition, 16);
    }
  }, [initialPosition, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
};

export default function BusinessSignUpFormMainSec({ countries, citizenships, industries, mainCategories, mainActivities }) {
  const loginType = localStorage.getItem('loginType')
  const [initialPosition, setInitialPosition] = useState([0, 0]);
  const [location, setLocation] = useState({ lat: initialPosition[0], lng: initialPosition[1] });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(Cookies.get('currentStep') ? Cookies.get('currentStep') : 'One');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      company_name: '',
      company_email: '',
      phone_one: '',
      phone_one_code: '',
      phone_two: '',
      phone_two_code: '',
      referral_code: '',
      company_main_type: '',
      registeration_number: '',
      category_id: '',
      sub_category_id: '',
      activity_id: '',
      sub_activity_id: '',
      industry_id: '',
      website_link: '',
      documents: '',
      logo: '',

      company_country_id: '',
      company_city_id: '',
      company_area_id: '',
      company_full_address: '',
      longitude: '',
      latitude: '',

      employee_name: '',
      employee_email: '',
      employee_phone: '',
      employee_phone_code: '',
      employee_title: '',
      employee_country_id: '',
      employee_city_id: '',
      employee_full_address: '',
      employee_citizenship_id: '',
      official_id_or_passport: '',
      employee_password: '',
      employee_password_confirmation: '',
      comfirm_policies: false,
      is_benifical_owner: false,
    },
    resolver: zodResolver(BusinessRegisterSchema),
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialPosition([latitude, longitude]);
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          toast.error(`${error}`);
        }
      );
    }
  }, []);

  // BusinessTypes Logic
  const [currentBusinessTypes, setCurrentBusinessTypes] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const handleChangeBusinessType = (event) => {
    const toastId = toast.loading('Loading , Please Wait !');
    const chosenType = allTypes.find(el => el.id === +event?.target?.value);
    if (!currentBusinessTypes.find(el => chosenType?.id === +el)) {
      setCurrentBusinessTypes([...currentBusinessTypes, chosenType]);
      allTypes = allTypes.filter(el => el.id !== +chosenType.id);
      setSelectValue('');
      toast.success(`( ${chosenType.name} ) Added Successfully.`, {
        id: toastId,
        duration: 2000
      });
    } else {
      toast.success(`( ${chosenType.name} ) Added Before.`, {
        id: toastId,
        duration: 2000
      });
    }
  };
  const handleDeleteBusinessType = (type) => {
    const toastId = toast.loading('Loading , Please Wait !');
    allTypes.push(type);
    setCurrentBusinessTypes(currentBusinessTypes?.filter(el => +el?.id !== +type?.id));
    toast.success(`( ${type.name} ) Removed Successfully.`, {
      id: toastId,
      duration: 2000
    });
  };

  // getting SubCategory From MainCategory Logic
  const [currentSubCategoriesInsideMainCategory, setCurrentSubCategoriesInsideMainCategory] = useState([]);
  useEffect(() => {
    setCurrentSubCategoriesInsideMainCategory([]);
    let currentCategoryId = watch('category_id');
    const currentCategory = mainCategories?.find(cat => cat?.mainCategoryId === +currentCategoryId);
    if (currentCategory) {
      setValue('sub_category_id', '');
      const toastId = toast.loading('Loading , Please Wait !');
      const subCatInsideCurrentMainCat = async () => {
        const response = await axios.get(`${baseURL}/main-categories/${currentCategory?.mainCategorySlug}`);
        if (response?.status === 200) {
          setCurrentSubCategoriesInsideMainCategory(response?.data?.data?.subCategories);
          toast.success(`( ${response?.data?.data?.mainCategoryName} )Category Added Successfully.`, {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error(`${response?.data?.error[0]}`, {
            id: toastId,
            duration: 2000
          });
          currentCategoryId = '';
        }
      };
      subCatInsideCurrentMainCat();
    };
  }, [watch('category_id')]);

  // getting SubActivities From MainActivities Logic
  const [allMainActivitiesChosen, setAllMainActivitiesChosen] = useState([]);
  const [allSubActsInsideMainActsChosen, setAllSubActsInsideMainActsChosen] = useState([]);
  const [chosenSubActivities, setChosenSubActivities] = useState([]);
  // const handleChangeMainActivities = (event) => {
  //   const toastId = toast.loading('Loading Sub Categories , Please Wait !');
  //   const chosenActivity = mainActivities?.find(el => el?.mainActivityId === +event?.target?.value);
  //   if (!allMainActivitiesChosen?.find(el => chosenActivity?.mainActivityId === el.mainActivityId)) {
  //     setAllMainActivitiesChosen([...allMainActivitiesChosen, chosenActivity]);
  //     const subActsInsideCurrentMainActs = async () => {
  //       const response = await axios.get(`${baseURL}/main-activities/${chosenActivity?.mainActivitySlug}`);
  //       if (response?.status === 200) {
  //         setAllSubActsInsideMainActsChosen([...allSubActsInsideMainActsChosen, response?.data?.data]);
  //         toast.success(`( ${chosenActivity?.mainActivityName} ) Sub Activities Loaded Successfully.`, {
  //           id: toastId,
  //           duration: 2000
  //         })
  //       } else {
  //         toast.error(`( ${chosenActivity?.mainActivityName} ) has already been selected`, {
  //           id: toastId,
  //           duration: 2000
  //         });
  //       };
  //     };
  //     subActsInsideCurrentMainActs();
  //     setSelectValue('');
  //   } else {
  //     toast.error(`( ${chosenActivity?.mainActivityName} ) has already been selected`, {
  //       id: toastId,
  //       duration: 2000
  //     });
  //   };
  // };
  // const handleDeleteMainActivity = (act) => {
  //   setAllMainActivitiesChosen(allMainActivitiesChosen.filter(el => +el?.mainActivityId !== +act?.mainActivityId));
  //   const deletedActivity = allMainActivitiesChosen.filter(el => +el?.mainActivityId === +act?.mainActivityId);
  //   const subActsInsideDeletedActivity = async () => {
  //     const response = await axios.get(`${baseURL}/main-activities/${deletedActivity[0].mainActivitySlug}`);
  //     const subActivitiesInsideDeletedActivity = [...response?.data?.data?.subActivities];
  //     setChosenSubActivities(chosenSubActivities.filter((subAct) =>
  //       !subActivitiesInsideDeletedActivity.some(el => subAct.subActivityId === el.subActivityId)
  //     ));
  //   };
  //   subActsInsideDeletedActivity();
  //   setAllSubActsInsideMainActsChosen(
  //     allSubActsInsideMainActsChosen.filter(el => +el?.mainActivityId !== +deletedActivity[0]?.mainActivityId)
  //   );
  // };
  // // getting SlectedArrOfSubActivities Logic
  // const handleChangeSubActivity = (event) => {
  //   const toastId = toast.loading('Loading Sub Categories , Please Wait !');
  //   const chosenSubActivityArr = allSubActsInsideMainActsChosen?.map(el =>
  //     el?.subActivities?.find(subAct => +subAct?.subActivityId === +event?.target?.value));
  //   const chosenSubActivity = chosenSubActivityArr.find(el => el && el);
  //   if (!chosenSubActivities?.find(el => chosenSubActivity?.subActivityId === +el?.subActivityId)) {
  //     setChosenSubActivities([...chosenSubActivities, chosenSubActivity]);
  //     toast.success(`( ${chosenSubActivity?.subActivityName} ) Added Successfully`, {
  //       id: toastId,
  //       duration: 2000
  //     });
  //   } else {
  //     toast.error(`( ${chosenSubActivity?.subActivityName} ) were Added Before`, {
  //       id: toastId,
  //       duration: 2000
  //     });
  //   };
  // };
  // const handleDeleteSubActivity = (subAct) => {
  //   setChosenSubActivities(chosenSubActivities.filter(el => +el?.subActivityId !== +subAct?.subActivityId));
  // };

  // Getting DocumentsArray
  const [documents, setDocuments] = useState([]);
  const handleGettingFile = (event) => {
    setDocuments([...documents, ...event?.target?.files]);
    setValue('documents', ...documents);
  };
  const handleDeleteFile = (doc) => {
    setDocuments(documents.filter(document => document.name !== doc.name));
    setValue('documents', ...documents);
  };

  // getting Cities InsideCurrentChosenCountry
  const [currentCitiesInsideCountry, setCurrentCitiesInsideCountry] = useState([]);
  useEffect(() => {
    setCurrentCitiesInsideCountry([]);
    let currentCountryId = watch('company_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`);
        setCurrentCitiesInsideCountry(response?.data?.data?.cities);
      };
      citiesInsideCurrentCountry();
      if (currentCitiesInsideCountry) {
        toast.success('Cities Loaded Successfully.', {
          id: toastId,
          duration: 2000
        });
      } else {
        toast.error('Somthing Went Wrong Please Choose Your Country Again!', {
          id: toastId,
          duration: 2000
        });
        currentCountryId = '';
      }
    };
    setValue('company_city_id', '');
  }, [watch('company_country_id')]);

  // getting Areas InsideCurrentChosenCity
  const [currentAreasInsideCities, setCurrentAreasInsideCities] = useState([]);
  useEffect(() => {
    setCurrentAreasInsideCities([]);
    let currentCityId = +watch('company_city_id');
    if (currentCityId) {
      const toastId = toast.loading('Loading Areas , Please Wait !');
      const AreasInsideCurrentCities = async () => {
        const response = await axios.get(`${baseURL}/cities/${currentCityId}`);
        setCurrentAreasInsideCities(response?.data?.data?.areas);
      };
      AreasInsideCurrentCities();
      if (currentAreasInsideCities) {
        toast.success('Areas Loaded Successfully.', {
          id: toastId,
          duration: 2000
        });
      } else {
        toast.error('Somthing Went Wrong Please Choose Your City Again!', {
          id: toastId,
          duration: 2000
        });
        currentCityId = '';
      }
    };
    setValue('company_area_id', '');
  }, [watch('company_city_id')]);

  // getting Cities InsideCurrentChosenCountry For Employee
  const [currentEmployeeCitiesInsideCountry, setCurrentEmployeeCitiesInsideCountry] = useState([]);
  useEffect(() => {
    setCurrentEmployeeCitiesInsideCountry([]);
    let currentCountryId = watch('employee_country_id');
    const currentCountry = countries?.find(country => country?.id === +currentCountryId);
    if (currentCountry) {
      const toastId = toast.loading('Loading Cities , Please Wait !');
      const citiesInsideCurrentCountry = async () => {
        const response = await axios.get(`${baseURL}/countries/${currentCountry?.code}`);
        if (response?.status === 200) {
          setCurrentEmployeeCitiesInsideCountry(response?.data?.data?.cities);
          toast.success('Cities Loaded Successfully.', {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error('Somthing Went Wrong Please Choose Your Country Again!', {
            id: toastId,
            duration: 2000
          });
          currentCountryId = ''
        };
      };
      citiesInsideCurrentCountry();
    };
  }, [watch('employee_country_id')]);

  useEffect(() => {
    setValue('longitude', location.lng);
    setValue('latitude', location.lat);
    setValue('documents', documents);
    setValue('sub_activity_id', chosenSubActivities.map(el => el?.subActivityId));
    setValue('activity_id', allMainActivitiesChosen.map(el => el?.mainActivityId));
    setValue('company_main_type', currentBusinessTypes?.map(el => el?.name));
    if (watch('comfirm_policies') === true) {
      setValue('comfirm_policies', 1);
    } else if (watch('comfirm_policies') === false) {
      setValue('comfirm_policies', 0);
    };
    if (watch('is_benifical_owner') === true) {
      setValue('is_benifical_owner', 1);
    } else if (watch('is_benifical_owner') === false) {
      setValue('is_benifical_owner', 0);
    };
  }, [documents,
    chosenSubActivities,
    allMainActivitiesChosen,
    currentBusinessTypes,
    watch('comfirm_policies'),
    watch('is_benifical_owner')
  ]);

  const onSubmit = async (data) => {
    // setLoading(true);
    // const toastId = toast.loading('Please Wait...');
    // const formData = new FormData();
    // Object.keys(data).forEach((key) => {
    //   if (key !== 'logo' && key !== 'official_id_or_passport' && key !== 'documents' && !Array.isArray(data[key])) {
    //     formData.append(key, data[key]);
    //   } else if (Array.isArray(data[key]) && key !== 'documents') {
    //     data[key].forEach((item, index) => {
    //       formData.append(`${key}[${index}]`, item);
    //     });
    //   } else if (key === 'documents') {
    //     data[key].forEach((file, index) => {
    //       formData.append(`documents[${index}]`, file[0]);
    //     });
    //   }
    // });
    // if (data.logo) {
    //   formData.append('logo', data.logo[0]);
    // }
    // if (data.official_id_or_passport) {
    //   formData.append('official_id_or_passport', data.official_id_or_passport[0]);
    // }
    // await axios.post(`${baseURL}/company-registeration`, formData, {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   },
    // }).then(response => {
    //   toast.success(`${response?.data?.message}`, {
    //     id: toastId,
    //     duration: 2000
    //   });
    //   companyId = response?.data?.data?.companyId;
    //   scrollToTop();
    // }).catch(error => {
    //     setCurrentStep('One');
    //     Object.keys(error?.response?.data?.errors).forEach((key) => {
    //       setError(key, { message: error?.response?.data?.errors[key][0] });
    //     });
    //     window.scrollTo({ top: 400 });
    //     toast.error(error?.response?.data?.message, {
    //       id: toastId,
    //       duration: 2000
    //     });
    //   });
    // setLoading(false);
  };

  const handleChangeStep = (type) => {
    if (currentStep === 'One') {
      (async () => {
        const toastId = toast.loading('Please Wait...');
        const data = {
          company_name: watch('company_name'),
          company_email: watch('company_email'),
          phone_one: watch('phone_one'),
          phone_one_code: watch('phone_one_code'),
          phone_two: watch('phone_two'),
          phone_two_code: watch('phone_two_code'),
          referral_code: watch('referral_code'),
          company_main_type: watch('company_main_type'),
          registeration_number: watch('registeration_number'),
          category_id: watch('category_id'),
          sub_category_id: watch('sub_category_id'),
          activity_id: watch('activity_id'),
          sub_activity_id: watch('sub_activity_id'),
          industry_id: watch('industry_id'),
          website_link: watch('website_link'),
          documents: watch('documents'),
          logo: watch('logo'),
        };
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key !== 'logo' && key !== 'documents' && !Array.isArray(data[key])) {
            formData.append(key, data[key]);
          } else if (Array.isArray(data[key]) && key !== 'documents') {
            data[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (key === 'documents') {
            data[key].forEach((file, index) => {
              formData.append(`documents[${index}]`, file);
            });
          };
        });
        if (data.logo) {
          formData.append('logo', data.logo);
        }
        await axios.post(`${baseURL}/company-registeration-step-one`, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }).then(response => {
          Cookies.set('companyRegId', response?.data?.data?.companyId);
          toast.success(`${response?.data?.message}`, {
            id: toastId,
            duration: 1000
          });
          scrollToTop();
          setCurrentStep('Two');
        }).catch(error => {
          setCurrentStep('One');
          if (error?.response?.data?.errors) {
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
          }
          window.scrollTo({ top: 400 });
          toast.error(error?.response?.data?.message, {
            id: toastId,
            duration: 1000
          });
        });
      })();
    } else if (currentStep === 'Two') {
      type === 'nextStep' ?
        (async () => {
          const toastId = toast.loading('Please Wait...');
          const data = {
            company_id: Cookies.get('companyRegId'),
            longitude: watch('longitude'),
            latitude: watch('latitude'),
            company_full_address: watch('company_full_address'),
            company_area_id: watch('company_area_id'),
            company_city_id: watch('company_city_id'),
            company_country_id: watch('company_country_id'),
          };
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key !== 'logo' && key !== 'documents' && !Array.isArray(data[key])) {
              formData.append(key, data[key]);
            } else if (Array.isArray(data[key]) && key !== 'documents') {
              data[key].forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            };
          });
          await axios.post(`${baseURL}/company-registeration-step-two`, formData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }).then(response => {
            toast.success(`${response?.data?.message}`, {
              id: toastId,
              duration: 1000
            });
            scrollToTop();
            setCurrentStep('Three');
          }).catch(error => {
            setCurrentStep('Two');
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
            window.scrollTo({ top: 400 });
            toast.error(error?.response?.data?.message, {
              id: toastId,
              duration: 1000
            });
          })
        })()
        :
        setCurrentStep('One');
    } else if (currentStep === 'Three') {
      type === 'nextStep' ?
        (async () => {
          const toastId = toast.loading('Please Wait...');
          const data = {
            company_id: Cookies.get('companyRegId'),
            employee_name: watch('employee_name'),
            employee_email: watch('employee_email'),
            employee_phone: watch('employee_phone'),
            employee_phone_code: watch('employee_phone_code'),
            employee_title: watch('employee_title'),
            employee_country_id: watch('employee_country_id'),
            employee_city_id: watch('employee_city_id'),
            employee_full_address: watch('employee_full_address'),
            employee_citizenship_id: watch('employee_citizenship_id'),
            official_id_or_passport: watch('official_id_or_passport'),
            employee_password: watch('employee_password'),
            employee_password_confirmation: watch('employee_password_confirmation'),
            comfirm_policies: watch('comfirm_policies'),
            is_benifical_owner: watch('is_benifical_owner'),
          };
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            if (key !== 'official_id_or_passport') {
              formData.append(key, data[key]);
            }
          });
          if (data.official_id_or_passport) {
            formData.append('official_id_or_passport', data.official_id_or_passport[0]);
          };
          await axios.post(`${baseURL}/company-registeration-step-three`, formData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }).then(response => {
            toast.success(`${response?.data?.message}`, {
              id: toastId,
              duration: 1000
            });
            Cookies.remove('currentStep');
            scrollToTop();
            navigate('/');
          }).catch(error => {
            setCurrentStep('Three');
            Object.keys(error?.response?.data?.errors).forEach((key) => {
              setError(key, { message: error?.response?.data?.errors[key][0] });
            });
            window.scrollTo({ top: 400 });
            toast.error(error?.response?.data?.message, {
              id: toastId,
              duration: 1000
            });
          });
        })()
        :
        setCurrentStep('Two');
    } else if (currentStep === 'Four') {
      setCurrentStep('Three');
    };
  };

  // image preview
  const [imagePreviews, setImagePreviews] = useState({});

  const handleImageChange = (e) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      setValue('logo',files[0]);
      setImagePreviews((prevState) => ({
        ...prevState,
        [id]: URL.createObjectURL(files[0])
      }));
    }
  };

  useEffect(() => {
    if (watch('password') !== watch('password_confirmation')) {
      setError('password_confirmation', { message: 'Passwords do not match' });
    } else if (watch('password_confirmation') === watch('password')) {
      clearErrors("password_confirmation");
    };
  }, [watch('password_confirmation')]);
  useEffect(() => {
    if (watch('employee_password') !== watch('employee_password_confirmation')) {
      setError('employee_password_confirmation', { message: 'Passwords do not match' });
    } else if (watch('employee_password_confirmation') === watch('employee_password')) {
      clearErrors("employee_password_confirmation");
    };
  }, [watch('employee_password_confirmation')]);

  return (
    <>
      {
        loading ?
          <MyLoader />
          :
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

                      {
                        currentStep === 'One' &&
                        <h3 className="col-12 text-center py-5 signUpForm__head">
                          Business Information
                        </h3>
                      }
                      <form onSubmit={handleSubmit(onSubmit)} className='row'>
                        {/* Step One */}
                        {
                          currentStep === 'One' &&
                          <>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_name">
                                Company Name <span className="requiredStar">*</span> 
                                <i title="ReachMagnet" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_name'
                                placeholder='Company’s Name'
                                {...register('company_name')}
                                className={`form-control signUpInput ${errors.company_name ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_name
                                &&
                                (<span className='errorMessage'>{errors.company_name.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_email">
                                E-mail Address <span className="requiredStar">*</span>
                                <i title="user@gmail.com" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_email'
                                placeholder='ex: admin@gmail.com'
                                {...register('company_email')}
                                className={`form-control signUpInput ${errors.company_email ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_email
                                &&
                                (<span className='errorMessage'>{errors.company_email.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpPhone_numberOne">
                                First Phone Number
                                <span className="requiredStar"> *</span>
                                <i title="01099558877" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="row">
                                <div className="col-3">
                                  <CustomDropdown
                                    countries={countries}
                                    setValue={setValue}
                                    errors={errors}
                                    inputName={'phone_one_code'}
                                  />
                                </div>
                                <div className="col-9">
                                  <input
                                    type='number'
                                    id='signUpPhone_numberOne'
                                    placeholder="Company's First Phone Number"
                                    {...register('phone_one')}
                                    className={`form-control signUpInput ${errors.phone_one ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.phone_one
                                    &&
                                    (<span className='errorMessage'>{errors.phone_one.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpPhone_numberTwo">
                                Second Phone Number
                                <span className="optional">(Optional)</span>
                                <i title="01088998899" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="row">
                                <div className="col-3">
                                  <CustomDropdown
                                    countries={countries}
                                    setValue={setValue}
                                    errors={errors}
                                    inputName={'phone_two_code'}
                                  />
                                </div>
                                <div className="col-9">
                                  <input
                                    type='number'
                                    id='signUpPhone_numberTwo'
                                    placeholder="Company's Second Phone Number"
                                    {...register('phone_two')}
                                    className={`form-control signUpInput ${errors.phone_two ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.phone_two
                                    &&
                                    (<span className='errorMessage'>{errors.phone_two.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpregisteration_number">
                                Registration Number
                                <span className="requiredStar"> *</span>
                                <i title="123456" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='number'
                                id='signUpregisteration_number'
                                placeholder="Company's Registeration Number"
                                {...register('registeration_number')}
                                className={`form-control signUpInput ${errors.registeration_number ? 'inputError' : ''}`}
                              />
                              {
                                errors.registeration_number
                                &&
                                (<span className='errorMessage'>{errors.registeration_number.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpreferral_code">
                                Referral Code
                                <span className="optional"> (Optional)</span>
                                <i title="abc123" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpreferral_code'
                                placeholder="Referral Code"
                                {...register('referral_code')}
                                className={`form-control signUpInput ${errors.referral_code ? 'inputError' : ''}`}
                              />
                              {
                                errors.referral_code
                                &&
                                (<span className='errorMessage'>{errors.referral_code.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpindustry_id">
                                Industry <span className="requiredStar">*</span>
                                <i title="industry" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpindustry_id"
                                className={`form-select signUpInput ${errors.industry_id ? 'inputError' : ''}`}
                                {...register('industry_id')} >
                                <option value="" disabled>
                                  Select an industry
                                </option>
                                {industries?.map((industry) => (
                                  <option key={industry?.id} value={industry?.id}>
                                    {industry?.name}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.industry_id &&
                                <span className="errorMessage">{errors.industry_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpCompany_main_types">
                                Business Types
                                <span className="requiredStar"> * </span>
                                <span className="optional">(MultiChoice)</span>
                                <i title="Company Offers Customization" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                onChange={handleChangeBusinessType}
                                id="signUpCompany_main_types"
                                value={selectValue}
                                className={`form-select signUpInput ${errors.company_main_type ? 'inputError' : ''}`}
                              >
                                <option value="" disabled>
                                  Select Type Of Business
                                </option>
                                {allTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                              <div>
                                {currentBusinessTypes.map((type) => (
                                  <span className='chosen__choice' key={type.id}>
                                    {type.name}
                                    <i
                                      onClick={() => handleDeleteBusinessType(type)}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.company_main_type
                                &&
                                (<span className='errorMessage'>{errors.company_main_type.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcategory_id">
                                Business Main Category
                                <span className="requiredStar"> *</span>
                                <i title="business category" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpcategory_id"
                                defaultValue={''}
                                className={`form-select signUpInput ${errors.category_id ? 'inputError' : ''}`}
                                {...register('category_id')} >
                                <option value="" disabled>
                                  Select a Category
                                </option>
                                {mainCategories?.map((cat) => (
                                  <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>
                                    {cat?.mainCategoryName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.category_id
                                &&
                                (<span className='errorMessage'>{errors.category_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpsub_category_id">
                                Business Sub-Category
                                <span className="requiredStar"> *</span>
                                <i title="business subcategory" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpsub_category_id"
                                  className={`form-select signUpInput ${errors.sub_category_id ? 'inputError' : ''}`}
                                  {...register('sub_category_id')} >
                                  <option value="" disabled>
                                    Select a Sub-Category
                                  </option>
                                  {currentSubCategoriesInsideMainCategory?.map((subCat) => (
                                    <option key={subCat?.subCategoryId} value={subCat?.subCategoryId}>
                                      {subCat?.subCategoryName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {
                                errors.sub_category_id
                                &&
                                (<span className='errorMessage'>{errors.sub_category_id.message}</span>)
                              }
                            </div>
                            {/* <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpactivity_id">
                                Business Main Activity
                                <span className="requiredStar"> * </span>
                                <span className="optional">(MultiChoice)</span>
                              </label>
                              <select
                                id="signUpactivity_id"
                                value={selectValue}
                                className={`form-select signUpInput ${errors.activity_id ? 'inputError' : ''}`}
                                onChange={handleChangeMainActivities}
                              >
                                <option value="" disabled>
                                  Select a Activity
                                </option>
                                {mainActivities?.map((activity) => (
                                  <option key={activity?.mainActivityId} value={activity?.mainActivityId}>
                                    {activity?.mainActivityName}
                                  </option>
                                ))}
                              </select>
                              <div>
                                {allMainActivitiesChosen.map((act) => (
                                  <span className='chosen__choice' key={act?.mainActivityId}>
                                    {act.mainActivityName}
                                    <i
                                      onClick={() => {
                                        handleDeleteMainActivity(act);
                                      }}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.activity_id
                                &&
                                (<span className='errorMessage'>{errors.activity_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpsub_activity_id">
                                Business Sub-Activity
                                <span className="requiredStar"> * </span>
                                <span className="optional">(MultiChoice)</span>
                              </label>
                              <select
                                onChange={handleChangeSubActivity}
                                value={selectValue}
                                id="signUpsub_activity_id"
                                className={`form-select signUpInput ${errors.sub_activity_id ? 'inputError' : ''}`}
                              >
                                <option value="" disabled>
                                  Select a Sub-Activity
                                </option>
                                {allSubActsInsideMainActsChosen?.map(activity => activity?.subActivities?.map((subAct) =>
                                  <option key={subAct?.subActivityId} value={subAct?.subActivityId}>
                                    {subAct?.subActivityName}
                                  </option>
                                ))}
                              </select>
                              <div>
                                {chosenSubActivities?.map((subAct) => (
                                  <span className='chosen__choice' key={subAct?.subActivityId}>
                                    {subAct.subActivityName}
                                    <i
                                      onClick={() => {
                                        handleDeleteSubActivity(subAct);
                                      }}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.sub_activity_id
                                &&
                                (<span className='errorMessage'>{errors.sub_activity_id.message}</span>)
                              }
                            </div> */}
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpwebsite_link">
                                Website Link
                                <span className="requiredStar"> *</span>
                                <i title="https://uiverse.io" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpwebsite_link'
                                placeholder="Company's Website Link"
                                {...register('website_link')}
                                className={`form-control signUpInput ${errors.website_link ? 'inputError' : ''}`}
                              />
                              {
                                errors.website_link
                                &&
                                (<span className='errorMessage'>{errors.website_link.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpBusinessdocuments">
                                Company's Documents <span className="requiredStar"> * </span>
                                <span className="optional">(MultiChoice)</span>
                                <i title="document.pdf" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                onChange={handleGettingFile}
                                type='file'
                                multiple
                                id='signUpBusinessdocuments'
                                className={`form-control newUploadBtn ${errors.documents ? 'inputError' : ''}`}
                              />
                              <div>

                                {documents?.map((doc, idx) => (
                                  <span className='chosen__choice' key={doc?.lastModified} title={doc?.name}>
                                    {(doc?.name)?.slice(0, 20)}
                                    <i
                                      onClick={() => {
                                        handleDeleteFile(doc);
                                      }}
                                      className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                  </span>
                                ))}
                              </div>
                              {
                                errors.documents
                                &&
                                (<p className='errorMessage'>{errors.documents.message}</p>)
                              }
                            </div>
                            <div className="col-lg-12 mb-4 position-relative">
                              <label htmlFor="compnayLogo" className=''>
                                Company's Logo<span className="requiredStar"> * </span>
                                <i title="logo.png" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='file'
                                id='compnayLogo'
                                className={`form-control newUploadBtn ${errors.logo ? 'inputError' : ''}`}
                                onChange={handleImageChange}
                                required
                              />

                              {
                                errors.logo
                                &&
                                (<p className='errorMessage'>{errors.logo.message}</p>)
                              }
                              {imagePreviews['compnayLogo'] && (
                                <div className='image-preview'>
                                  <img src={imagePreviews['compnayLogo']} alt="Selected profile" style={{ maxWidth: '100px', height: '100px', marginTop: '10px', borderRadius: '12px' }} />
                                </div>
                              )}
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='nextStep__btn' onClick={() => handleChangeStep('nextStep')}>
                                Next Step <i className="bi bi-arrow-right-circle"></i>
                              </button>
                            </div>
                          </>
                        }

                        {/* Step Two */}
                        {
                          currentStep === 'Two' &&
                          <>
                            <div className="signUpForm__head col-12 mt-5 mb-3 pt-4">
                              <h4>
                                Business Registered Address
                              </h4>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_country_id">
                                Country / Region <span className="requiredStar">*</span>
                                <i title="Egypt" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpcompany_country_id"
                                  className={`form-select signUpInput ${errors.company_country_id ? 'inputError' : ''}`}
                                  {...register('company_country_id')} >
                                  <option value="" disabled>
                                    Select a Country
                                  </option>
                                  {countries?.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>

                              </div>
                              {
                                errors.company_country_id
                                &&
                                (<span className='errorMessage'>{errors.company_country_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_city_id">
                                City <span className="requiredStar">*</span>
                                <i title="Cairo" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpcompany_city_id"
                                className={`form-select signUpInput ${errors.company_city_id ? 'inputError' : ''}`}
                                {...register('company_city_id')} >
                                <option value="" disabled>
                                  Select a City
                                </option>
                                {currentCitiesInsideCountry?.map((city) => (
                                  <option key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.company_city_id &&
                                <span className="errorMessage">{errors.company_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_area_id">
                                Area <span className="requiredStar">*</span>
                                <i title="Al Maadi" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpcompany_area_id"
                                className={`form-select signUpInput ${errors.company_area_id ? 'inputError' : ''}`}
                                {...register('company_area_id')} >
                                <option value="" disabled>
                                  Select an Area
                                </option>
                                {currentAreasInsideCities?.map((area) => (
                                  <option key={area.areaId} value={area.areaId}>
                                    {area.areaName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.company_city_id &&
                                <span className="errorMessage">{errors.company_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpcompany_full_address">
                                Company Full Address  <span className="requiredStar">*</span>
                                <i title="1th cornesh almaadi street" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpcompany_full_address'
                                placeholder='Street name, City , Zip Code ...'
                                {...register('company_full_address')}
                                className={`form-control signUpInput ${errors.company_full_address ? 'inputError' : ''}`}
                              />
                              {
                                errors.company_full_address
                                &&
                                (<span className='errorMessage'>{errors.company_full_address.message}</span>)
                              }
                            </div>
                            <div className="col-lg-12 mb-4">
                              <ul className='d-flex align-items-center gap-3 flex-wrap'>
                                <li className='d-flex gap-2 flex-wrap'>
                                  <label className='mapLabel'>Latitude:</label>
                                  <input
                                    type="text"
                                    value={location.lat || ''}
                                    readOnly={true}
                                    className='signUpInput input-readOnly'
                                  />
                                  {
                                    errors.latitude
                                    &&
                                    (<span className='errorMessage'>{errors.latitude.message}</span>)
                                  }
                                </li>
                                <li className='d-flex gap-2 flex-wrap'>
                                  <label className='mapLabel'>Longitude:</label>
                                  <input
                                    type="text"
                                    value={location.lng || ''}
                                    readOnly={true}
                                    className='signUpInput input-readOnly'
                                  />
                                  {
                                    errors.longitude
                                    &&
                                    (<span className='errorMessage'>{errors.longitude.message}</span>)
                                  }
                                </li>
                              </ul>
                              <MapContainer center={initialPosition} zoom={0} style={{ height: '400px', width: '100%', zIndex: '1' }}>
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker setLocation={setLocation} initialPosition={initialPosition} />
                              </MapContainer>
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className="bi bi-arrow-left-circle"></i> Prev Step
                              </button>
                              <button type="button" className='nextStep__btn' onClick={() => handleChangeStep('nextStep')}>
                                Next Step <i className="bi bi-arrow-right-circle"></i>
                              </button>
                            </div>
                          </>
                        }

                        {/* Step Three */}
                        {
                          currentStep === 'Three' &&
                          <>
                            <div className="col-lg-12 my-5">
                              <h3 className='signUpForm__head mt-5 text-center'>
                                Owner Information
                              </h3>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_name">
                                Owner's Name <span className="requiredStar">*</span>
                                <i title="Mohamed Fahim" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_name'
                                placeholder='Employee Name'
                                {...register('employee_name')}
                                className={`form-control signUpInput ${errors.employee_name ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_name
                                &&
                                (<span className='errorMessage'>{errors.employee_name.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_email">
                                E-mail <span className="requiredStar">*</span>
                                <i title="mohamed@gmail.com" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_email'
                                placeholder='ex: employee@gmail.com'
                                {...register('employee_email')}
                                className={`form-control signUpInput ${errors.employee_email ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_email
                                &&
                                (<span className='errorMessage'>{errors.employee_email.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_phone">
                                Mobile Number <span className="requiredStar"> * </span>
                                <i title="01055588899" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="row">
                                <div className="col-3">
                                <CustomDropdown
                                countries={countries}
                                setValue={setValue}
                                errors={errors}
                                inputName={'employee_phone_code'}
                              />
                                </div>
                                <div className="col-9">
                                  <input
                                    type='number'
                                    id='signUpemployee_phone'
                                    placeholder='Enter Employee phone number'
                                    {...register('employee_phone')}
                                    className={`form-control signUpInput ${errors.employee_phone ? 'inputError' : ''}`}
                                  />
                                  {
                                    errors.employee_phone
                                    &&
                                    (<span className='errorMessage'>{errors.employee_phone.message}</span>)
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_title">
                                Title <span className="requiredStar"> *</span>
                                <i title="SEO" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_title'
                                placeholder="Employee's title in the company"
                                {...register('employee_title')}
                                className={`form-control signUpInput ${errors.employee_title ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_title
                                &&
                                (<span className='errorMessage'>{errors.employee_title.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_country_id">
                                <span className='fs-6'>(Country / Region)</span> <span className="requiredStar">*</span>
                                <i title="saudia Arabia" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="position-relative">
                                <select
                                  id="signUpemployee_country_id"
                                  className={`form-select signUpInput ${errors.employee_country_id ? 'inputError' : ''}`}
                                  {...register('employee_country_id')} >
                                  <option value="" disabled>
                                    Select a Country
                                  </option>
                                  {countries?.map((country) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {
                                errors.employee_country_id
                                &&
                                (<span className='errorMessage'>{errors.employee_country_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_city_id">
                                City <span className="requiredStar">*</span>
                                <i title="Al Madina" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id="signUpemployee_city_id"
                                className={`form-select signUpInput ${errors.employee_city_id ? 'inputError' : ''}`}
                                {...register('employee_city_id')} >
                                <option value="" disabled>
                                  Select a City
                                </option>
                                {currentEmployeeCitiesInsideCountry?.map((city) => (
                                  <option key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                  </option>
                                ))}
                              </select>
                              {
                                errors.employee_city_id &&
                                <span className="errorMessage">{errors.employee_city_id.message}</span>
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_full_address">
                                Full Address  <span className="requiredStar">*</span>
                                <i title="1th almadina abd street" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='text'
                                id='signUpemployee_full_address'
                                placeholder='Street name, City , Zip Code ...'
                                {...register('employee_full_address')}
                                className={`form-control signUpInput ${errors.employee_full_address ? 'inputError' : ''}`}
                              />
                              {
                                errors.employee_full_address
                                &&
                                (<span className='errorMessage'>{errors.employee_full_address.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_citizenship_id">
                                Citizenship <span className="requiredStar"> *</span>
                                <i title="egyptian" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <select
                                id='signUpemployee_citizenship_id'
                                defaultValue={''}
                                {...register('employee_citizenship_id')}
                                className={`form-select signUpInput ${errors.employee_citizenship_id ? 'inputError' : ''}`}
                              >
                                <option value='' disabled>Select Your Citizenship</option>
                                {
                                  citizenships?.map(el => (
                                    <option key={el?.id} value={el?.id}>
                                      {el?.name}
                                    </option>
                                  ))
                                }
                              </select>
                              {
                                errors.employee_citizenship_id
                                &&
                                (<span className='errorMessage'>{errors.employee_citizenship_id.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_password">
                                Password <span className="requiredStar"> *</span>
                                <i title="Mohamed@123" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`${showPassword ? 'text' : 'password'}`}
                                  id='signUpemployee_password'
                                  placeholder='Min 8: upper, lower, number, symbol.'
                                  {...register('employee_password')}
                                  className={`form-control signUpInput ${errors.employee_password ? 'inputError' : ''}`}
                                />
                                <div className="leftShowPasssord" onClick={() => setShowPassword(!showPassword)}>
                                  {
                                    showPassword ?
                                      <i className="bi bi-eye-slash"></i>
                                      :
                                      <i className="bi bi-eye-fill"></i>
                                  }
                                </div>
                              </div>
                              {
                                errors.employee_password
                                &&
                                (<span className='errorMessage'>{errors.employee_password.message}</span>)
                              }
                            </div>
                            <div className="col-lg-6 mb-4">
                              <label htmlFor="signUpemployee_password_confirmation">
                                Confirm Password <span className="requiredStar"> *</span>
                                <i title="Same as Password" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <div className="position-relative">
                                <input
                                  type={`${showConfirmPassword ? 'text' : 'password'}`}
                                  id='signUpemployee_password_confirmation'
                                  placeholder='Enter 8-digit password'
                                  {...register('employee_password_confirmation')}
                                  className={`form-control signUpInput ${errors.employee_password_confirmation ? 'inputError' : ''}`}
                                />
                                <div className="leftShowPasssord" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                  {
                                    showConfirmPassword ?
                                      <i className="bi bi-eye-slash"></i>
                                      :
                                      <i className="bi bi-eye-fill"></i>
                                  }
                                </div>
                              </div>
                              {
                                errors.employee_password_confirmation
                                &&
                                (<span className='errorMessage'>{errors.employee_password_confirmation.message}</span>)
                              }
                            </div>
                            <div className='col-lg-6'>
                              <label htmlFor="signUpofficial_id_or_passport">
                                Owner's <span className="optional">(Official-ID / Passport)</span><span className="requiredStar"> *</span>
                                <i title="" className="bi bi-info-circle ms-1 cursorPointer"></i>
                              </label>
                              <input
                                type='file'
                                id='signUpofficial_id_or_passport'
                                {...register('official_id_or_passport')}
                                className={`form-control newUploadBtn ${errors.official_id_or_passport ? 'inputError' : ''}`}
                              />
                              {
                                errors.official_id_or_passport
                                &&
                                (<p className='errorMessage'>{errors.official_id_or_passport.message}</p>)
                              }

                            </div>
                            <div className="col-lg-8 my-4">
                              <label
                                htmlFor="singUpcomfirm_policies"
                                className='row justify-content-start align-items-start'>
                                <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                                  <input
                                    type="checkbox"
                                    id="singUpcomfirm_policies"
                                    {...register('comfirm_policies')}
                                    className='signUpCheckBox'
                                  />
                                  <span className="checkmark"></span>
                                </p>
                                <p className="col-md-11 p-0 col-sm-10 checkBox-text">
                                  I confirm of acting on own behalf or on behalf of registered business, and I commit to updating the beneficial ownership information whenever a change has been made
                                </p>
                              </label>
                              {errors.comfirm_policies && <p className='errorMessage'>{errors.comfirm_policies.message}</p>}
                            </div>
                            <div className="col-lg-8 mb-4">
                              <label
                                htmlFor="singUpis_benifical_owner"
                                className='row justify-content-start align-items-start'>
                                <p className="signUpCostom-checkBox col-md-1 col-sm-2 mt-1">
                                  <input
                                    type="checkbox"
                                    id="singUpis_benifical_owner"
                                    {...register('is_benifical_owner')}
                                    className='signUpCheckBox'
                                  />
                                  <span className="checkmark mt-1"></span>
                                </p>
                                <p className="col-md-11 p-0 pt-2 col-sm-10 is_benifical_owner checkBox-text">
                                  Owner of the Company
                                </p>
                              </label>
                              {errors.is_benifical_owner && <p className='errorMessage'>{errors.is_benifical_owner.message}</p>}
                            </div>
                            {/* <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className="bi bi-arrow-left-circle"></i> Prev Step
                              </button>
                            </div> */}
                          </>
                        }

                        {/* Step Four */}
                        {
                          currentStep === 'Four' &&
                          <div className="col-lg-12">
                            <BusinessSignUpPackages />
                          </div>
                        }

                        {
                          currentStep === 'Three' &&
                          <div className="col-lg-12 text-center mt-5 signUp__submitBtn">
                            <input disabled={isSubmitting} type="button" value={'Submit For Review'} onClick={() => handleChangeStep('nextStep')} />
                            <div className="col-12 d-flex justify-content-center align-items-center gap-3 mb-4">
                              <button type="button" className='prevStep__btn' onClick={() => handleChangeStep('prevStep')}>
                                <i className="bi bi-arrow-left-circle"></i> Prev Step
                              </button>
                            </div>
                          </div>
                        }
                      </form>
                      <div className="col-lg-12 signUpOtherWays text-center pe-4">
                        <div className="serviceTerms">
                          <p className='businessPrivacy'>
                            Once you submit for review our Team will start reviewing all the details, you will be notified through your E-mail within 5-7 business days.
                          </p>
                          <p>
                            By continuing, you agree to ReachMagnet's<br />  Terms of Service and acknowledge that you've read our Privacy Policy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};