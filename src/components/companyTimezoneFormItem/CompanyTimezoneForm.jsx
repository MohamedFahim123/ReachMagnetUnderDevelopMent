import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import CompanyTimezoneFormTable from '../companyTimezoneFormTableSec/CompanyTimezoneFormTable';

export default function CompanyTimezoneForm({ token ,setUnAuth }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])
    const [editMode, setEditMode] = useState(false);

    const fetchShowCompany = async () => {
        try {
            const slug = loginType === 'user' ? 'user/profile' : 'employee/show-company'
            const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (loginType === 'user') {
                setNewdata(response?.data?.data?.user?.timezone);
            }else{
                setNewdata(response?.data?.data?.timezone);

            }
        } catch (error) {
            if(error?.response?.data?.message === 'Unauthorized'){
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Somthing Went Wrong');
        };
    };
    useEffect(() => {
        fetchShowCompany();
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
        <CompanyTimezoneFormTable setUnAuth={setUnAuth} token={token} timezone={newData} editMode={editMode} setEditMode={setEditMode} fetchShowCompany={fetchShowCompany}/>
    )}
    
    </div>
  )
}
