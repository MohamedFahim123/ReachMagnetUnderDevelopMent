import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDataFromAPI } from '../../functions/fetchAPI';
import toast from 'react-hot-toast';
import CompanyActivityFormTable from '../companyActivityFormTable/CompanyActivityFormTable';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';

export default function CompanyActivitiesForm(token, setUnAuth) {
  const [companyActivities, setCompanyActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const activitiesFinalShape = { activity_id: [], sub_activity_id: [] };
  const [updatePointer, setUpdatePointer] = useState(true);
  const loginType = localStorage.getItem('loginType');
  const [editMode, setEditMode] = useState(false);

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
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      activity_id: '',
      sub_activity_id: '',
    }
  });

  useEffect(() => {
    if(token && loginType === 'employee'){
      if(!editMode){
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
    };
  }, []);

  const handleAddMoreActivities = () => {
    setCompanyActivities([...companyActivities, { mainActivityName: '', subActivityName: '' }])
  };

  const handleDeleteThisTable = (index) => {
    setCompanyActivities(companyActivities?.filter((el, idx) => idx !== index));
  };

  useEffect(() => {
    const arrOfMainActNames = companyActivities?.map(el => el.mainActivityName);
    activitiesFinalShape.activity_id.push(...allActivities?.reduce((acc, item) => {
      if (arrOfMainActNames.includes(item.mainActivityName)) {
        acc.push(item.mainActivityId);
      }
      return acc;
    }, []));
    setValue('activity_id', activitiesFinalShape.activity_id);
  }, [companyActivities, updatePointer]);

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please Wait...');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      data[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='profileForm__handler my-4'>
      <button type='button' className='editModeBtn' onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel Update' : 'Update Activities'}
      </button>
      {companyActivities?.map((el, idx) => {
        return (
          !editMode ?
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
            :
            <div className='text-center w-100' key={idx}>
              <div className='w-100 d-flex gap-3'>
                <CompanyActivityFormTable
                  activityUpdateStatus={editMode}
                  index={idx}
                  allActivities={allActivities}
                  currMainActivityName={el?.mainActivityName}
                  currsubActivityName={el?.subActivityName}
                  errors={errors}
                  handleDeleteThisTable={handleDeleteThisTable}
                  companyActivities={companyActivities}
                  setUpdatePointer={setUpdatePointer}
                  updatePointer={updatePointer}
                  subActivityFinal={activitiesFinalShape?.sub_activity_id}
                  setValue={setValue}
                />
              </div>
              {
                editMode &&
                <div className="profileFormInputItem text-center flex-1">
                  <button onClick={() => handleDeleteThisTable(idx)} type='button' className='deleteBtn'>
                    delete <i className="bi bi-trash3"></i>
                  </button>
                </div>
              }
            </div>
        )
      })}
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