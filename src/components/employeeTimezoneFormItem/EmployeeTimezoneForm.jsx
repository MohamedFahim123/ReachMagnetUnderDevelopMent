import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import EmployeeTimezoneFormTable from '../employeeTimezoneFormTableSec/EmployeeTimezoneFormTable';
export default function EmployeeTimezoneForm({ token ,setUnAuth }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])
    const [editMode, setEditMode] = useState(false);

    const fetchShowEmployeeProfile = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-profile?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
                setNewdata(response?.data?.data?.timezone);
        } catch (error) {
            if(error?.response?.data?.message === 'Unauthorized'){
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Somthing Went Wrong');
        };
    };
    useEffect(() => {
        fetchShowEmployeeProfile();
    }, [loginType, token]);
  return (
    <div className='companyWorkHourTable__handler'>
    <button className='editModeBtn' onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel Update' : 'Update Timezone'}
    </button>
    {!editMode ? (
        <form>

                <div className="w-100 WorkHourTables__box">
                    <div className="mt-2 profileFormInputItem">
                        <label>Time zone</label>
                        <input
                            className="form-control signUpInput mt-2"
                            value={newData}
                            type="text"
                            disabled
                        />
                    </div>
                </div>
          
        </form>
    ) : (
        <EmployeeTimezoneFormTable setUnAuth={setUnAuth} token={token} timezone={newData} editMode={editMode} setEditMode={setEditMode} fetchShowEmployeeProfile={fetchShowEmployeeProfile}/>
    )}
    
    </div>
  )
}
