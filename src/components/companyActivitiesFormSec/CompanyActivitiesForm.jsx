import React, { act, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDataFromAPI } from '../../functions/fetchAPI';
import toast from 'react-hot-toast';
import CompanyActivityFormTable from '../companyActivityFormTable/CompanyActivityFormTable';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

// const activitiesFinalShape = { activity_id: [], sub_activity_id: [] };

export default function CompanyActivitiesForm(token, setUnAuth, mainActivities) {
  const [companyActivities, setCompanyActivities] = useState([]);
  const [activitiesFinalShape, setActivitiesFinalShape] = useState({ activity_id: [], sub_activity_id: [] });
  const [allActivities, setAllActivities] = useState([]);
  const [updatePointer, setUpdatePointer] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [editMode, setEditMode] = useState(false);
  const [editCase, setEditCase] = useState(false)
  useEffect(() => {
    getDataFromAPI('main-activities')
      .then((response) => {
        setAllActivities(response?.mainActivities);
      })
      .catch((error) => {
        if (error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        }
        toast.error(error?.response?.data?.message, {
          duration: 1000,
        });
      });
  }, []);

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    if(token && loginType === 'employee'){
      
        (async()=>{
          axios.get(`${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`,{
            headers:{
              Authorization: `Bearer ${token.token}`
            }
          })
          .then(res => {
            setCompanyActivities(res?.data?.data?.companyActivities);
          })
          .catch(err => {
            toast.error(err?.response?.data?.message);
          })
        })();
      
    };
  }, []);

  // const handleAddMoreActivities = () => {
  //   setActivitiesFinalShape({activity_id: [...activitiesFinalShape.activity_id, ''], sub_activity_id:[...activitiesFinalShape.sub_activity_id, '']})
  // };
 

  // const handleDeleteThisTable = (index) => {
  //   const deletedActivity = activitiesFinalShape.activity_id?.filter((el,idx)=>(
  //     index !== idx && el
  //   ))  
  //   const deletedSubAvtivity = activitiesFinalShape.sub_activity_id?.filter((el,idx)=>(
  //     index !== idx && el
  //   ))    
  //   console.log(deletedActivity, deletedSubAvtivity);
    
  //   setActivitiesFinalShape({activity_id: deletedActivity, sub_activity_id:deletedSubAvtivity})
  //   setEditCase(!editCase)
  // };

  // useEffect(()=>{

  //   const arrOfMainActNames = companyActivities?.map(el => el.mainActivityName);
  //   const filteredActivities = arrOfMainActNames?.map(item => allActivities.find((el)=>el.mainActivityName === item));
  //   const activitySlugs = filteredActivities?.map(item => item.mainActivitySlug);
  //   console.log(filteredActivities);
  //   setActivitiesFinalShape()


  //   const finalShape = {...activitiesFinalShape, activity_id:activitySlugs}
  //   activitySlugs.map((slug,idx)=>(
  //   (async()=>{
  //     const response = await axios.get(`${baseURL}/main-activities/${slug}`);
  //     finalShape.activity_id[idx] = response?.data?.data?.mainActivityId;
  //     finalShape.sub_activity_id?.push(response?.data?.data?.subActivities?.find((subAct)=>(subAct.subActivityName === companyActivities[idx]?.subActivityName))?.subActivityId);
  //   })()
  // ))
  // setActivitiesFinalShape(finalShape)
  // },[companyActivities])

  useEffect(() => {
    const fetchActivityDetails = async () => {
      const arrOfMainActNames = companyActivities?.map((el) => el.mainActivityName);
      const filteredActivities = arrOfMainActNames?.map((item) =>
        allActivities.find((el) => el.mainActivityName === item)
      );
      const activitySlugs = filteredActivities?.map((item) => item?.mainActivitySlug);

      const finalShape = { activity_id: [], sub_activity_id: [] };

      for (const [idx, slug] of activitySlugs.entries()) {
        if (slug) {
          try {
            const response = await axios.get(`${baseURL}/main-activities/${slug}`);
            const mainActivityId = response?.data?.data?.mainActivityId || '';
            const subActivities = response?.data?.data?.subActivities || [];

            finalShape.activity_id.push({
              id: Date.now() + idx,
              value: mainActivityId,
            });

            const subActivity = subActivities.find(
              (subAct) => subAct.subActivityName === companyActivities[idx]?.subActivityName
            );

            finalShape.sub_activity_id.push({
              id: Date.now() + idx,
              value: subActivity?.subActivityId || '',
            });
          } catch (error) {
            console.error('Error fetching activity details:', error);
            toast.error('Failed to load activity details.');
          }
        } else {
          finalShape.activity_id.push({ id: Date.now() + idx, value: '' });
          finalShape.sub_activity_id.push({ id: Date.now() + idx, value: '' });
        }
      }

      setActivitiesFinalShape(finalShape);
    };

    if (companyActivities.length > 0 && allActivities.length > 0) {
      fetchActivityDetails();
    }
  }, [companyActivities, allActivities]);

  const handleAddMoreActivities = () => {
    setActivitiesFinalShape((prevState) => ({
      activity_id: [...prevState.activity_id, { id: Date.now(), value: '' }],
      sub_activity_id: [...prevState.sub_activity_id, { id: Date.now(), value: '' }],
    }));
  };


  const handleDeleteThisTable = (id) => {
    setActivitiesFinalShape((prevState) => ({
      activity_id: prevState.activity_id.filter((item) => item.id !== id),
      sub_activity_id: prevState.sub_activity_id.filter((item) => item.id !== id),
    }));
    setUpdatePointer((prev) => !prev);
  };

// (async()=>{
//   console.log(await activitiesFinalShape?.activity_id);
// })()
  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(activitiesFinalShape).forEach((key) => {
      activitiesFinalShape[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item.value);
      });
    });
    await axios.post(`${baseURL}/${loginType}/update-company-activities?t=${new Date().getTime()}`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token.token}`,
      },
    }).then(response => {
      toast.success(`${response?.data?.message}.`, {
        id: toastId,
        duration: 1000,
      });
      window.location.reload();
    })
      .catch(error => {
        if (error?.response?.data?.message === 'Unauthorized') {
          setUnAuth(true);
        };
        toast.error(error?.response?.data?.message, {
          id: toastId,
          duration: 2000
        });
      });
  };
  const [currentSubActivitiesInsideMainActivity, setcurrentSubActivitiesInsideMainActivity] = useState([]);
  useEffect(() => {
    setcurrentSubActivitiesInsideMainActivity([]);
    let currentActivityId = watch('activity_id');
    const currentActivity = mainActivities?.find(Act => Act?.mainActivityId === +currentActivityId);
    if (currentActivity) {
      setValue('sub_activity_id', '');
      const toastId = toast.loading('Loading , Please Wait !');
      const subActInsideCurrentMainAct = async () => {
        const response = await axios.get(`${baseURL}/main-activities/${currentActivity?.mainActivitySlug}`);
        if (response?.status === 200) {
          setcurrentSubActivitiesInsideMainActivity(response?.data?.data?.subActivities);
          toast.success(`( ${response?.data?.data?.mainActivityName} )Activity Added Successfully.`, {
            id: toastId,
            duration: 2000
          });
        } else {
          toast.error(`${response?.data?.error[0]}`, {
            id: toastId,
            duration: 2000
          });
          currentActivityId = '';
        }
      };
      subActInsideCurrentMainAct();
    };
  }, [watch('activity_id')]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      <button type='button' className='editModeBtn' onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel Update' : 'Update Activities'}
      </button>
      {!editMode ?
        companyActivities?.map((el, idx) => {
        return (
          
            <div key={idx} className='w-100 row'>
              <div className='col-6 mt-2 profileFormInputItem'>
                <label htmlFor="dashboardCompanyMainActivity">Main Activity</label>
                <input
                  id='dashboardCompanyMainActivity'
                  className='form-control signUpInput w-100 mt-2'
                  value={el?.mainActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
              <div className='col-6 mt-2 profileFormInputItem'>
                <label htmlFor="dashboardCompanySubActivity">Sub Activity</label>
                <input
                  id='dashboardCompanySubActivity'
                  className='form-control signUpInput w-100 mt-2'
                  value={el?.subActivityName}
                  type="text"
                  disabled={true}
                />
              </div>
              
            </div>
          
        )})
      :
      activitiesFinalShape?.activity_id?.map((el,idx)=>(
        <div className='text-center w-100' key={el?.id}>
          <div className='w-100 d-flex gap-3'>
            <CompanyActivityFormTable
              activityUpdateStatus={editMode}
              index={el?.id}
              allActivities={allActivities}
              currMainActivity={el.value}
              currsubActivity={activitiesFinalShape.sub_activity_id.find((sub) => sub.id === el.id)?.value}
              errors={errors}
              companyActivities={companyActivities}
              setUpdatePointer={setUpdatePointer}
              updatePointer={updatePointer}
              // subActivityFinal={activitiesFinalShape?.sub_activity_id}
              setValue={setValue}
              activitiesFinalShape={activitiesFinalShape}
            />
          </div>
          
            <div className="profileFormInputItem text-center flex-1">
              <button onClick={() => handleDeleteThisTable(el?.id)} type='button' className='deleteBtn'>
                delete <i className="bi bi-trash3"></i>
              </button>
            </div>
          
        </div>
      ))
     
}
      {
        editMode &&
        <div className="formActions text-center">
          <button type="button" className="btn btn-secondary my-3 w-100" onClick={handleAddMoreActivities}>
            + Add More Company Activities
          </button>
          <button type="submit" className="updateBtn mt-3">
            Submit Changes
          </button>
        </div>
      }
    </form>
  );
};