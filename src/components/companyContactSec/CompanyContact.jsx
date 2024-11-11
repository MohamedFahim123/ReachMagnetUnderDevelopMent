import React, { useEffect, useState } from 'react';
import './companyContact.css';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import FranchiseSec from '../franchiseSecc/FranchiseSec';

export default function CompanyContact({ token, companyId, company }) {
  const convertToUnderscore = (str) => {
    return str.replace(/\s+/g, '_');
  };
  const [formId, setFormId] = useState(undefined);
  const [formInputs, setFormInputs] = useState({});
  const [checkBox,setCheckBoxValue] = useState([]);
  const [fileData,setFileData] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    if (!formId) {
      setFormId(company?.data?.company?.companyForms[0]?.formId);
    }
  }, [company]);

  useEffect(() => {
    if (token && formId) {
      (async () => {
        const toastId = toast.loading('Loading Forms...');
        await axios.post(`${baseURL}/user/show-form?t=${new Date().getTime()}`, {
          form_id: `${formId}`,
          company_id: companyId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((response) => {
          setFormInputs(response?.data?.data);
          toast.success(`Form Feilds Loaded Successfully.`, {
            id: toastId,
            duration: 1000,
          });
        }).catch(errors => {
          toast.error(`${errors?.response?.data?.message}`, {
            id: toastId,
            duration: 1000,
          });
        });
      })();
    };
  }, [companyId, formId, token]);

  const onSubmit = async (data) => {
    data.company_id = companyId;
    data.form_id = `${formId}`;
    data = {...data , [fileData.name]: fileData?.value};
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key] && typeof(data[key]) !== 'object')) {
        data[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      }else {
        formData.append(key, data[key]);
      }
    });
    const toastId = toast.loading('Please Wait...');
    await axios.post(`${baseURL}/user/fill-form`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    }).then(response => {
      toast.success(`${response?.data?.message}.`, {
        id: toastId,
        duration: 1000
      });
      reset();
    })
    .catch(error => {
      if (error?.response?.data?.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
          setError(key, { message: error.response.data.errors[key][0] });
        });
      };
      toast.error(error?.response?.data?.message, {
        id: toastId,
        duration: 2000,
      });
    });
  };

  const gettingInputData = (form) => {
    const returnedData = [];
    form?.formFields?.map((input, idx) => {
      const inputType = input?.type;
      const inputName = convertToUnderscore(input?.name);
      if (inputType === 'text' || inputType === 'email') {
        returnedData.push(<div key={idx} className='mb-4'>
          <label htmlFor={`${inputName}CompanyContact`}>
            {input?.name}
          </label>
          <input
            className={`w-100 ${errors[inputName] ? 'inputError' : ''}`}
            type={inputType}
            name={`${inputName}CompanyContact`}
            id={`${inputName}CompanyContact`}
            placeholder={input?.name}
            {...register(inputName, {
              required: `${inputName} is required`,
            })}
          />
          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      } else if (inputType === 'textarea') {
        returnedData.push(
          <div key={idx} className='mb-4'>
            <label htmlFor={`${inputName}CompanyContact`}>
              {input?.name}
            </label>
            <textarea
              className={`w-100 ${errors[inputName] ? 'inputError' : ''}`}
              type={inputType}
              name={`${inputName}CompanyContact`}
              id={`${inputName}CompanyContact`}
              placeholder={input?.name}
              {...register(inputName, {
                required: `${inputName} is required`,
              })}
            ></textarea>
            {
              errors[inputName] &&
              <span className='errorMessage'>{errors[inputName].message}</span>
            }
          </div>
        );
      } else if (inputType === "radio") {
        const options = input?.options;
        returnedData.push(<div key={idx} className='mb-4'>
          <label>
            {input?.name}
          </label>
          {
            options?.map(option => (
              <div className='form-check' key={option?.optionId}>
                <input
                  className={`form-check-input p-0 me-2 ${errors[inputName] ? 'inputError' : ''}`}
                  type={inputType}
                  name={`${inputName}CompanyContact`}
                  id={`${inputName}CompanyContact-${option?.optionId}`}
                  value={option?.optionId}
                  {...register(inputName)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${inputName}CompanyContact-${option?.optionId}`}
                >
                  {option?.optionValue}
                </label>
              </div>
            ))
          }

          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      } else if (inputType === "checkbox") {
        const options = input?.options;
        returnedData.push(<div key={idx} className='mb-4'>
          <label>
            {input?.name}
          </label>
          {
            options?.map(option => (
              <div className='form-check' key={option?.optionId}>
                <input
                  className={`form-check-input p-0 me-2 ${errors[inputName] ? 'inputError' : ''}`}
                  type={inputType}
                  name={`${inputName}CompanyContact`}
                  id={`${inputName}CompanyContact-${option?.optionId}`}
                  value={option?.optionId}
                  onClick={()=>{
                    if(checkBox?.length === 0){
                      setCheckBoxValue([option?.optionId]);
                      setValue(inputName,[option?.optionId]);
                    }else {
                      if(checkBox?.find(el => +el === +option?.optionId)){
                        const updatedValue = checkBox?.filter(el => +el !== +option?.optionId);
                        setCheckBoxValue(updatedValue);
                        setValue(inputName,updatedValue);
                      }else{
                        const updatedValue = [...checkBox ,option?.optionId];
                        setCheckBoxValue(updatedValue);
                        setValue(inputName,updatedValue);
                      }
                    };
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`${inputName}CompanyContact-${option?.optionId}`}
                >
                  {option?.optionValue}
                </label>
              </div>
            ))
          }

          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      } else if(inputType === 'select') { 
        const options = input?.options;
        returnedData.push(<div key={idx} className='mb-4'>
          <label htmlFor={`${inputName}CompanyContact`}>
            {input?.name}
          </label>
          <select 
            className={`form-select w-100 ${errors[inputName] ? 'inputError' : ''}`} 
            id={`${inputName}CompanyContact`}
            {...register(inputName, {
              required: `${inputName} is required`,
            })}
            defaultValue={''}
          >
            <option disabled value="">{inputName}</option>
          {
            options?.map(option => (
              <option key={option?.optionId} value={option?.optionId}>{option?.optionValue}</option>
            ))
          }
          </select>

          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      } else if(inputType === 'file') {
        returnedData.push(<div key={idx} className='mb-4'>
          <label htmlFor={`${inputName}CompanyContact`}>
            {input?.name}
          </label>
          <input
            className={`w-100 ${errors[inputName] ? 'inputError' : ''}`}
            type={inputType}
            name={`${inputName}CompanyContact`}
            id={`${inputName}CompanyContact`}
            placeholder={input?.name}
            onChange={(e)=> {
              setFileData({type: inputType, name: inputName ,value: e.target.files[0]});
            }}
          />
          {
            errors[inputName] &&
            <span className='errorMessage'>{errors[inputName].message}</span>
          }
        </div>);
      };
    });
    return (returnedData);
  };


  return (
    <div className='contact__mainSec'>
      <div className="container">
        <div className="row">
          {
            token ?
              <div className="col-lg-12">
                <div className="contactCompany-type">
                  <ul className='d-flex flex-wrap'>
                    {company?.data?.company?.companyForms?.map((el) => {
                      return (
                        <li key={el?.formId} onClick={() => {
                          setFormId(el?.formId);
                          setCheckBoxValue([]);
                        }} className={`${(+el?.formId === +formId) && 'contactCompany-type-active'}`}>
                          {el?.formTitle}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="contactCompany__form">

                  <form method='POST' className='p-3' onSubmit={handleSubmit(onSubmit)}>
                    {gettingInputData(formInputs)}
                    <input
                      className='contactCompany__form-submitBtn'
                      type='submit'
                      id="submitCompanyFormBtn"
                      name='submitCompanyFormBtn'
                      value={isSubmitting ? 'Sending ...' : 'Submit'}
                      disabled={isSubmitting}
                    />
                  </form>
                </div>
              </div>
              :
              <div className="col-12">
                <FranchiseSec
                  pageName='discover'
                  headText='Contact Form'
                  paraText='From general Inqueries to booking appointements'
                  btnOneText='Login To Continue'
                  btnOnelink='/login'
                />
              </div>
          }

        </div>
      </div>
    </div>
  );
};
