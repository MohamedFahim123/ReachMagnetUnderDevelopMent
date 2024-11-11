import React, { useEffect, useRef, useState } from 'react';
import './activityTable.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyActivityFormTable(
  {index,
  errors,
  allActivities,
  currMainActivityName,
  companyActivities,
  currsubActivityName,
  setUpdatePointer,
  updatePointer,
  subActivityFinal,
  setValue
  }) {
  const [mainAct,setMainAct] = useState(allActivities?.find(act=> act?.mainActivityName === currMainActivityName) || {});
  const [subAct,setSubAct] = useState([]);
  const [defaultSubAct,setDefaultSubAct] = useState([]);
  useEffect(()=>{
    setMainAct(allActivities?.find(act=> act?.mainActivityName === currMainActivityName));
  },[currMainActivityName]);
  const fileInputRef = useRef(null);

  const subActsInsideCurrentMainActs = async (mainActivitySlug,mainActivityName,toastId) => {
    const response = await axios.get(`${baseURL}/main-activities/${mainActivitySlug}`);
    if(response?.status === 200){
      setSubAct(response?.data?.data?.subActivities);
      toast.success(`( ${mainActivityName} ) Sub-Activities Loaded Successfully.`,{
        id: toastId,
        duration: 1000
      });
      if(toastId){
        fileInputRef.current.value = '';
      };
      setDefaultSubAct(response?.data?.data?.subActivities?.find(e => e.subActivityName === currsubActivityName)?.subActivityId)
    }else{
      toast.error(`something went wrong ,Please try again !`,{
        id: toastId,
        duration: 1000
      });
    };
  };

  const handleChangeMainActivity = (event) => {
    const toastId = toast.loading('Loading Sub-Activities , Please Wait !');
    const chosenActivity = allActivities?.find(el => el?.mainActivityId === +event);
    if(!companyActivities.find(el => el?.mainActivityName === chosenActivity?.mainActivityName)){
      companyActivities[index].mainActivityName = chosenActivity?.mainActivityName;
      setUpdatePointer(!updatePointer);
      subActsInsideCurrentMainActs(chosenActivity?.mainActivitySlug,chosenActivity?.mainActivityName,toastId);
    }else {
      toast.error('This Main Activity Added Before!',{
        id: toastId,
        duration: 1000,
      });
      event = '';
    }
  };

  const handleChangeSubActivity = (event) => {
    const toastId = toast.loading('Adding Sub-Activity , Please Wait !');
    const chosenActivity = subAct?.find(el => el?.subActivityId === +event?.target?.value);
    if(!companyActivities.find(el => el?.subActivityName === chosenActivity?.subActivityName)){
      companyActivities[index].subActivityName = chosenActivity?.subActivityName;
      setUpdatePointer(!updatePointer);
      toast.success('Sub-Activity Added Successfuly.',{
        id: toastId,
        duration: 1000,
      });
    }else {
      toast.error('This Sub-Activity Added Before!',{
        id: toastId,
        duration: 1000,
      });
      event.target.value = '';
    };
  };

  useEffect(()=>{
    const arrOfSubActNames = companyActivities?.map(el => el.subActivityName);
    subActivityFinal.push(...subAct?.reduce((acc, item) => {
      if (arrOfSubActNames.includes(item.subActivityName)) {
        acc.push(item.subActivityId);
      }
      return acc;
    }, []));
    setValue('sub_activity_id',subActivityFinal);
  },[companyActivities,updatePointer]);

  useEffect(()=>{
    if(mainAct?.mainActivityId){
      subActsInsideCurrentMainActs(mainAct?.mainActivitySlug ,mainAct?.mainActivityName);
    };
  },[]);

  useEffect(()=>{
    if(defaultSubAct){
      fileInputRef.current.value = defaultSubAct;
    }
  },[defaultSubAct]);

  return (
    <>
      <div className='mt-2 profileFormInputItem activitiesSelect'>
        <select
          defaultValue={mainAct?.mainActivityId}
          onChange={(e) => handleChangeMainActivity(e.target.value)}
          className={`form-select signUpInput mt-2 ${errors?.activity_id?.message[index] ? 'inputError' : ''}`}
          id="dashboardCompanymainType"
        >
          <option disabled value="">Company Activity</option>
          {
            allActivities?.map(act=>{
              return(
                <option key={act?.mainActivityId} value={act?.mainActivityId}>{act?.mainActivityName}</option>
              );
            })
          }
        </select>
        {
          errors?.activity_id?.message[index] &&
          <span className='errorMessage'>{errors?.activity_id?.message[index]}</span>
        }
      </div>
      <div className='mt-2 profileFormInputItem activitiesSelect'>
      <select
          ref={fileInputRef}
          defaultValue={defaultSubAct}
          className={`form-select signUpInput mt-2 ${errors?.sub_activity_id?.message[index] ? 'inputError' : ''}`}
          id="dashboardCompanymainType"
          onChange={handleChangeSubActivity}
        >
          <option disabled value="">Company Sub-Activity</option>
          {
            subAct?.map(sub=>{
              return(
                <option key={sub?.subActivityId} value={sub?.subActivityId}>{sub?.subActivityName}</option>
              );
            })
          }
        </select>
        {
          errors?.sub_activity_id?.message[index] &&
          <span className='errorMessage'>{errors?.sub_activity_id?.message[index]}</span>
        }
      </div>

      </>
  )
}
