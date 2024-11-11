import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import CompanyWorkHourFormTable from '../companyWorkHourFormTableItem/CompanyWorkHourFormTable';
import toast from 'react-hot-toast';

export default function CompanyWorkHourForm({ token ,setUnAuth }) {
    const loginType = localStorage.getItem('loginType')
    const [newData, setNewdata] = useState([])
    const [editMode, setEditMode] = useState(false);

    const fetchShowCompany = async () => {
        try {
            const response = await axios.get(`${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewdata(response?.data?.data);
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
                {editMode ? 'Cancel Update' : 'Update Work Hours'}
            </button>
            {!editMode ? (
                <form>
                    {newData?.workingHours?.map((el, index) => (
                        <div key={index} className="w-100 WorkHourTables__box">
                            <div className="mt-2 profileFormInputItem">
                                <label>Day of Week</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.day_of_week}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="mt-2 profileFormInputItem">
                                <label>Opening Time</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.opening_time}
                                    type="text"
                                    disabled
                                />
                            </div>
                            <div className="mt-2 profileFormInputItem">
                                <label>Closing Time</label>
                                <input
                                    className="form-control signUpInput mt-2"
                                    value={el?.closing_time}
                                    type="text"
                                    disabled
                                />
                            </div>
                        </div>
                    ))}
                </form>
            ) : (
                <CompanyWorkHourFormTable setUnAuth={setUnAuth} token={token} workingHours={newData?.workingHours} editMode={editMode}/>
            )}
            
        </div>


    )
}
