import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import './companyWorkHourFormTable.css'
export default function CompanyWorkHourFormTable({ token, workingHours, editMode }) {
    const loginType = localStorage.getItem('loginType')
    const navigate = useNavigate()
    const [formData, setFormData] = useState(
        workingHours?.length !== 0
            ? {
                day_of_week: workingHours.map((el) => el.day_of_week),
                opening_time: workingHours.map((el) => el.opening_time),
                closing_time: workingHours.map((el) => el.closing_time),
            }
            : {
                day_of_week: [""],
                opening_time: [""],
                closing_time: [""],
            }
    );

    const handleInputChange = (index, name, value) => {
        setFormData((prevState) => {
            const updatedField = [...prevState[name]];
            updatedField[index] = value;
            return {
                ...prevState,
                [name]: updatedField,
            };
        });
    };
    const handleAddWorkingHour = () => {
        setFormData((prevState) => ({
            day_of_week: [...prevState.day_of_week, ""],
            opening_time: [...prevState.opening_time, ""],
            closing_time: [...prevState.closing_time, ""],
        }));
    };
    const handleDeleteWorkingHour = (index) => {
        setFormData((prevState) => ({
            day_of_week: prevState.day_of_week.filter((_, i) => i !== index),
            opening_time: prevState.opening_time.filter((_, i) => i !== index),
            closing_time: prevState.closing_time.filter((_, i) => i !== index),
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach((key) => {
            formData[key].forEach((value, index) => {
                submissionData.append(`${key}[${index}]`, value);
            });
        });

        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/update-company-working-hours?t=${new Date().getTime()}`,
                submissionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                navigate('/profile/business-settings');
                toast.success('Work hours updated successfully');
            } else {
                toast.error('Failed to update work hours');
            }
        } catch (error) {
            console.error('Error: ', error.response || error.message);
            toast.error('Error updating work hours.');
        }
    };
    console.log(formData);
    
    
    
    return (
        <form onSubmit={handleFormSubmit} className='companyWorkHourTable__handler'>
            {formData.day_of_week.map((day, index) => (
                <div key={index} className="w-100 WorkHourTables__box">

                    <div className="mt-2 profileFormInputItem">
                        <label>Day of Week</label>
                        <select
                            className="form-control custom-select signUpInput mt-2"
                            name="day_of_week"
                            value={formData.day_of_week[index]}
                            onChange={(e) =>
                                handleInputChange(index, 'day_of_week', e.target.value)
                            }
                        >
                            <option value="sunday">sunday</option>
                            <option value="monday">monday</option>
                            <option value="tuesday">tuesday</option>
                            <option value="wednesday">wednesday</option>
                            <option value="thursday">thursday</option>
                            <option value="friday">friday</option>
                            <option value="saturday">saturday</option>
                        </select>
                    </div>
                    <div className="mt-2 profileFormInputItem">
                        <label>Opening Time</label>
                        <input
                            className="form-control signUpInput mt-2"
                            name="opening_time"
                            value={!editMode ?  formData.opening_time[index] : formData.opening_time[0]}
                            type="time"
                            onChange={(e) =>
                                handleInputChange(index, 'opening_time', e.target.value)
                            }
                        />
                    </div>
                    <div className="mt-2 profileFormInputItem">
                        <label>Closing Time</label>
                        <input
                            className="form-control signUpInput mt-2"
                            name="closing_time"
                            value={formData.closing_time[index]}
                            type="time" 
                            onChange={(e) =>
                                handleInputChange(index, 'closing_time', e.target.value)
                            }
                        />
                    </div>
                    <div className="profileFormInputItem text-center mt-2">
                        <button onClick={() => handleDeleteWorkingHour(index)} type='button' className='deleteBtn'>
                            delete <i className="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            ))}
            <div className="formActions">
                <button type="button" className="btn btn-secondary mt-3" onClick={handleAddWorkingHour}>
                    + Add More Working Hours 
                </button>
                <button type="submit" className="updateBtn mt-3">
                    Submit Changes
                </button>
            </div>
        </form>
    )
}
