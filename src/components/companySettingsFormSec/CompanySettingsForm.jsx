import React, { useEffect, useState } from 'react';
import './CompanyEditForm.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import Cookies from 'js-cookie';
import { scrollToTop } from '../../functions/scrollToTop';
import { UpdateCompanyDataSchema } from '../../validation/UpdateCompanyDataSchema';

const allTypes =  [
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
let allTypesRendered = allTypes;

export default function CompanySettingsForm(
  {
    setUnAuth,
    token,
    mainCategories,
    imgChanged,coverChanged,
    currnetImageUpdateFile, currnetCoverUpdateFile,
    setCurrentImageUpdateError,setCurrentCoverUpdateError,
    company,
    setProfileUpdateStatus,
    profileUpdateStatus
  }
)

{
  const loginType =localStorage.getItem('loginType');
  const [subCategories,setSubCategories] = useState([]);
  const linkedInLink = company?.linkedin_link === 'N/A' ? '' : company?.linkedin_link;

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors , isSubmitting}
} = useForm({
    defaultValues: {
        email: company?.email,
        full_address: company?.full_address,
        category_id: '',
        sub_category_id: '',
        about_us: company?.about_us,
        logo: '',
        main_type: company?.companyTypes,
        cover: '',
        website_link: company?.website_link,
        linkedin_link: linkedInLink,
        founded: company?.founded,
    },
    resolver: zodResolver(UpdateCompanyDataSchema),
  });

  const [currentBusinessTypes , setCurrentBusinessTypes] = useState([]);
  const [selectValue,setSelectValue] = useState('');
  const handleChangeBusinessType = (event) => {
    const toastId = toast.loading('Loading , Please Wait !');
    const chosenType = allTypesRendered.find(el => el.id === +event?.target?.value);
    if(!currentBusinessTypes.find(el=> chosenType?.id === +el)){
      setCurrentBusinessTypes([...currentBusinessTypes,chosenType]);
      allTypesRendered = allTypesRendered.filter(el=>el.id !== +chosenType.id);
      toast.success(`( ${ chosenType.name } ) Added Successfully.`,{
        id: toastId,
        duration: 2000
      });
      setSelectValue('');
    }else {
      toast.success(`( ${ chosenType.name } ) Added Before.`,{
        id: toastId,
        duration: 2000
      });
    }
  };
  const handleDeleteBusinessType = (type) => {
    const toastId = toast.loading('Loading , Please Wait !');
    allTypesRendered.push(type);
    setCurrentBusinessTypes(currentBusinessTypes?.filter(el=> +el?.id !== +type?.id ));
    toast.success(`( ${ type.name } ) Removed Successfully.`,{
      id: toastId,
      duration: 2000
    });
  };

  useEffect( ()=>{
    setValue('email',company?.email);
    setValue('full_address',company?.full_address);
    setValue('about_us',company?.about_us);
    setValue('website_link',company?.website_link);
    setValue('linkedin_link',linkedInLink);
    setValue('founded',company?.founded);
    setValue('main_type',company?.companyTypes?.map(el => el?.type));
    setValue('category_id', `${mainCategories?.find(cat => cat?.mainCategoryName === company?.category )?.mainCategoryId}`);
    setValue('sub_category_id',`${subCategories?.find(cat => cat?.subCategoryName === company?.sub_category )?.subCategoryId}`);
    setCurrentBusinessTypes(allTypes.filter(type => watch('main_type')?.includes(type.name)));
    allTypesRendered = allTypesRendered.filter(type => !watch('main_type')?.includes(type.name));
  },[company,Cookies.get('currentUpdatedCompanyData')]);
  useEffect(()=>{
    setValue('logo',currnetImageUpdateFile);
  },[currnetImageUpdateFile]);
  useEffect(()=>{
    setValue('cover',currnetCoverUpdateFile);
  },[currnetCoverUpdateFile]);

  useEffect(() => {
    const currentChosenCategory = mainCategories?.find(cat => +cat?.mainCategoryId === +watch('category_id'));
    if(currentChosenCategory){
      (async () => { 
        try {
          const response = await axios.get(`${baseURL}/main-categories/${currentChosenCategory?.mainCategorySlug}`);
          setSubCategories(response?.data?.data?.subCategories);
        } catch(error) {
          toast.error(`${error?.response?.data?.message || 'Please try again !'}`);
        }
      })();
    }
  },[watch('category_id')]);

  const onSubmit = async (data) => {
  const toastId = toast.loading('Please Wait...');
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key !== 'logo' && key !== 'cover' && !Array.isArray(data[key])) {
      formData.append(key, data[key]);
    } else if (Array.isArray(data[key])) {
      data[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    }
  });
  if(imgChanged && data.logo[0]){
    formData.append('logo', data.logo[0]);
  };
  if(coverChanged && data.cover[0]){
    formData.append('cover', data.cover[0]);
  };
  await axios.post(`${baseURL}/${loginType}/update-company-data?t=${new Date().getTime()}`, formData, {
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
      Cookies.set('currentUpdatedCompanyData',JSON.stringify(response?.data?.data), { expires: 999999999999999 * 999999999999999 * 999999999999999 * 999999999999999 });
      localStorage.setItem('updatingCompany','notUpdating');
      window.location.reload();
    })
    .catch(error => {
      if(error?.response?.data?.errors){
        Object.keys(error?.response?.data?.errors).forEach((key) => {
          setError(key, {message: error?.response?.data?.errors[key][0]});
        });
      };
      if(error?.response?.data?.message === 'Unauthorized') {
        setUnAuth(true);
      };
      toast.error(error?.response?.data?.message,{
        id: toastId,
        duration: 2000
      });
    });
  };
  useEffect(()=>{
    if(errors?.logo) {
      setCurrentImageUpdateError(errors?.logo?.message);
    }else {
      setCurrentImageUpdateError(null)
    }
    if(errors?.cover) {
      setCurrentCoverUpdateError(errors?.cover?.message);
    }else {
      setCurrentCoverUpdateError(null)
    }
  },[errors?.logo,errors?.cover]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanyEmail">Company E-Mail</label>
        <input
          id='dashboardCompanyEmail'
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
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanywebsite_link">Company Link</label>
        <input
          id='dashboardCompanywebsite_link'
          className={`form-control signUpInput mt-2 ${errors?.website_link ? 'inputError' : ''}`}
          {...register('website_link')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.website_link
          &&
          (<span className='errorMessage'>{errors?.website_link?.message}</span>)
        }
      </div>
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanylinkedin_link">LinkedIn Link</label>
        <input
          id='dashboardCompanylinkedin_link'
          className={`form-control signUpInput mt-2 ${errors?.linkedin_link ? 'inputError' : ''}`}
          {...register('linkedin_link')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.linkedin_link
          &&
          (<span className='errorMessage'>{errors?.linkedin_link?.message}</span>)
        }
      </div>
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanyfounded">Founded</label>
        <input
          id='dashboardCompanyfounded'
          className={`form-control signUpInput mt-2 ${errors?.founded ? 'inputError' : ''}`}
          {...register('founded')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.founded
          &&
          (<span className='errorMessage'>{errors?.founded?.message}</span>)
        }
      </div>
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanyMainCategory">Main Category</label>
        {
          (profileUpdateStatus === 'notUpdating') ?
              <input
                  id='dashboardCompanyMainCategory'
                  className='form-control signUpInput mt-2'
                  defaultValue={company?.category}
                  type="text"
                  disabled={true}
              />
              :
              <>
              <select
                className={`form-select signUpInput mt-2 ${errors?.category_id ? 'inputError' : ''}`}
                {...register('category_id')}
                id="dashboardCompanyMainCategory"
              >
                <option disabled value="">Select Category</option>
                {
                  mainCategories?.map(cat => (
                      <option key={cat?.mainCategoryId} value={cat?.mainCategoryId}>{cat?.mainCategoryName}</option>
                  ))
                }
              </select>
              {
                errors?.category_id
                &&
                (<span className='errorMessage'>{errors?.category_id?.message}</span>)
              }
              </>
            }
      </div>
      <div className="mt-2 ms-2 profileFormInputItem cityContainerProfileForm">
        <label htmlFor="dashboardCompanySubCategory">Sub-Category</label>
        {
          (profileUpdateStatus === 'notUpdating') ?
              <input
                  id='dashboardCompanySubCategory'
                  className='form-control signUpInput mt-2'
                  defaultValue={company?.sub_category}
                  type="text"
                  disabled={true}
              />
              :
              <>
              <select
                className={`form-select signUpInput mt-2 ${errors?.sub_category_id ? 'inputError' : ''}`}
                {...register('sub_category_id')}
                id="dashboardCompanySubCategory"
              >
                <option disabled value="">Select Sub-Category</option>
                {
                  subCategories?.map(cat => (
                      <option key={cat?.subCategoryId} value={cat?.subCategoryId}>{cat?.subCategoryName}</option>
                  ))
                }
              </select>
              {
                errors?.sub_category_id
                &&
                (<span className='errorMessage'>{errors?.sub_category_id?.message}</span>)
              }
              </>
            }
      </div>
      <div className="mt-2 w-100 pe-4 ms-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyFullAddress">Company FullAddress</label>
        <textarea
          id='dashboardCompanyFullAddress'
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
      <div className="mt-2 w-100 pe-4 ms-2 profileFormInputItem">
        <label htmlFor="dashboardCompanyabout_us">About Company</label>
        <textarea
          id='dashboardCompanyabout_us'
          className={`form-control signUpInput mt-2 ${errors?.about_us ? 'inputError' : ''}`}
          {...register('about_us')}
          type="text"
          disabled={profileUpdateStatus === 'notUpdating'}
        />
        {
          errors?.about_us
          &&
          (<span className='errorMessage'>{errors?.about_us?.message}</span>)
        }
      </div>
      <div className={`mt-2 profileFormInputItem w-100 pe-4 ms-2 ${profileUpdateStatus === 'notUpdating' && 'ps-3'}`}>
        <label htmlFor="dashboardCompanymainType">Company Types</label>
        {(profileUpdateStatus === 'notUpdating') ?
          <div >
            {currentBusinessTypes?.map((el) => (
              <span className='chosen__choice' key={el?.id}>
                {el.name}
              </span>
            ))}
          </div>
        :
        <>
          <select
            defaultValue={selectValue}
            onChange={handleChangeBusinessType}
            className={`form-select signUpInput mt-2 ${errors?.country_id ? 'inputError' : ''}`}
            id="dashboardCompanymainType"
          >
          <option disabled value="">Select Company Types</option>
          {
            allTypesRendered?.map(type => (
              <option key={type?.id} value={type?.id}>{type?.name}</option>
            ))
          }
          </select>
          {
            errors?.main_type
            &&
            (<span className='errorMessage'>{errors?.main_type?.message}</span>)
          }
          {currentBusinessTypes?.map((el) => (
            <span className='chosen__choice' key={el?.id}>
              {el?.name}
              <i 
                onClick={()=>handleDeleteBusinessType(el)}
                className="bi bi-trash chosen__choice-delete"
              ></i>
            </span>
          ))}
        </>
        }
      </div>
      <div className={`bottomContainer pt-5 
          text-center m-auto
        `}>
        {
          (profileUpdateStatus === 'notUpdating') ?
            <span className={`startUpdateBtn ${isSubmitting && 'd-none'}`} onClick={() => {
              scrollToTop();
              localStorage.setItem('updatingProfile', 'updating');
              setProfileUpdateStatus(localStorage.getItem('updatingProfile'));
          }}>Update</span>
          :
          <input type="submit" disabled={isSubmitting} value="Confirm Changes" className='updateBtn mt-0' />
        }
      </div>
    </form>
  );
};
