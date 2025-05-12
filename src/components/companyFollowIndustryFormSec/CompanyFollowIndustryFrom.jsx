import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function CompanyFollowIndustryFrom({ token, setUnAuth }) {
    const loginType = localStorage.getItem('loginType')
    const [currIndustries, setCurrIndustries] = useState([]);
    const [allIndustries, setAllIndustries] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedSubIndustries, setSelectedSubIndustries] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchCurrentIndustries = async () => {
        const apiURL =
            loginType === 'user'
                ? `${baseURL}/${loginType}/profile?t=${new Date().getTime()}`
                : `${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`;
        try {
            const response = await axios.get(apiURL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const industries =
                loginType === 'user'
                    ? response?.data?.data?.user?.industries
                    : response?.data?.data?.companyIndustries;

            setCurrIndustries(industries || []);
        } catch (error) {
            if (error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data.message || 'Somthing Went Wrong');
        };
    };

    const fetchAllIndustries = async () => {
        try {
            const response = await axios.get(`${baseURL}/industries?t=${new Date().getTime()}`);
            setAllIndustries(response?.data?.data?.industries || []);
        } catch (error) {
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
        }
    };

    useEffect(() => {
        fetchCurrentIndustries();
        fetchAllIndustries()
    }, [loginType, token]);

    const handleAddIndustry = (industryId) => {
        const industry = allIndustries.find((indus) => indus.id === industryId);
        if (industry && !selectedIndustries.some((ind) => ind.id === industry.id)) {
            setSelectedIndustries([...selectedIndustries, industry]);
            setSelectedSubIndustries(prev => ({
                ...prev,
                [industry.id]: []
            }));
        }
    };
    const handleAddSubIndustry = (industryId, subIndustryId) => {
        setSelectedSubIndustries(prev => ({
            ...prev,
            [industryId]: [...new Set([...prev[industryId], subIndustryId])]
        }));
    };

  

    const handleConfirmChanges = async () => {
        if (loginType === 'user') {
            // Get industries to follow and unfollow
            const industriesToFollow = selectedIndustries.filter(
                (ind) => !currIndustries.some((currInd) => currInd.id === ind.id)
            );
            const industriesToUnfollow = currIndustries.filter(
                (currInd) => !selectedIndustries.some((ind) => ind.id === currInd.id)
            );
    
            try {
                // Follow new industries
                if (industriesToFollow.length > 0) {
                    const industryIdsToFollow = industriesToFollow.map((ind) => ind.id);
                    const allIndustryIds = [
                        ...currIndustries.map((ind) => ind.id),
                        ...industryIdsToFollow,
                    ];
                    await axios.post(
                        `${baseURL}/user/follow-industries`,
                        { industry_id: allIndustryIds },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    toast.success('Industries added successfully');
                }
    
                // Unfollow removed industries
                if (industriesToUnfollow.length > 0) {
                    for (const industry of industriesToUnfollow) {
                        await axios.post(
                            `${baseURL}/user/unfollow-industry`,
                            { industry_id: String(industry.id) }, // Ensure industry_id is a string
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    }
                    toast.success('Industries removed successfully');
                }
    
                // Fetch updated industries from backend
                await fetchCurrentIndustries(); // Ensure state is updated before proceeding
                setIsEditing(false);
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.errors?.industry_id?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to update industries';
                toast.error(errorMessage);
            }
        } else {
            // Handle employee logic
            const industryIds = selectedIndustries.map((ind) => ind.id);
            const subIndustryIds = Object.entries(selectedSubIndustries)
            .flatMap(([industryId, subIndustries]) =>
                subIndustries.map(subId => ({ industry_id: Number(industryId), sub_industry_id: subId }))
            );
            try {
                await axios.post(
                    `${baseURL}/employee/update-company-industires`,
                    { industry_id: industryIds, sub_industries: subIndustryIds },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success('Industries updated successfully');
                fetchCurrentIndustries();
                setIsEditing(false); 
            } catch (error) {
                toast.error(error?.response?.data.message || 'Failed to update industries');
            }
        }
    };
    
    
    console.log(selectedIndustries);
    




    return (
        <form className='profileForm__handler my-4'>
            <div className={`mt-2 profileFormInputItem w-100 pe-4 ms-2 'ps-3'}`}>
                <label htmlFor="dashboardCompanymainType">{loginType ==='user' ? 'User Industries' : 'Company Industries' }</label>
                {!isEditing ? (
                    <>
                        <div>
                            {currIndustries.map((el) => (
                                <span className='chosen__choice' key={el?.industryId}>
                                    {el?.industryName}
                                </span>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(true);
                                    setSelectedIndustries(currIndustries);
                                }}
                                className="btn btn-primary"
                            >
                                Update
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <select
                            defaultValue=""
                            onChange={(e) => handleAddIndustry(Number(e.target.value))}
                            className={`form-select signUpInput mt-2`}
                            id="dashboardCompanymainType"
                        >
                            <option disabled value="">Select Industry</option>
                            {allIndustries.map((indus) => (
                                <option key={indus?.id} value={indus?.id}>
                                    {indus?.name}
                                </option>
                            ))}
                        </select>
                        {/* Selected Industries with delete option */}
                        {/* <div className="mt-3">
                            {selectedIndustries.map((el) => (
                                <span className='chosen__choice' key={el?.id}>
                                    {el?.name}
                                    <i
                                        onClick={() =>
                                            setSelectedIndustries((prev) =>
                                                prev.filter((ind) => ind.id !== el.id)
                                            )
                                        }
                                        className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                </span>
                            ))}
                        </div> */}

                    <div className="mt-3">
                        {selectedIndustries?.map((el) => (
                            <div key={el.id}>
                                <span className='chosen__choice'>
                                    {el.industryName || el?.name}
                                    <i
                                        onClick={() => {
                                            setSelectedIndustries(prev => prev.filter(ind => ind.id !== el.id));
                                            setSelectedSubIndustries(prev => {
                                                const updated = { ...prev };
                                                delete updated[el.id];
                                                return updated;
                                            });
                                        }}
                                        className="bi bi-trash chosen__choice-delete"
                                    ></i>
                                </span>
                                
                                {/* Sub-Industry Dropdown */}
                                {el?.sub_industries?.length > 0 && (
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleAddSubIndustry(el.id, Number(e.target.value))}
                                        className="form-select signUpInput mt-2"
                                    >
                                        <option disabled value="">Select Sub-Industry</option>
                                        {el?.sub_industries?.map((sub) => (
                                            <option key={sub?.id} value={sub?.id}>{sub?.name}</option>
                                        ))}
                                    </select>
                                )}

                                {/* Display Selected Sub-Industries */}
                                {selectedSubIndustries[el.id]?.length > 0 && (
                                    <div>
                                        {selectedSubIndustries[el.id]?.map(subId => {
                                            const subIndustry = el?.sub_industries?.find(sub => sub.id === subId);
                                            return subIndustry ? (
                                                <span className='chosen__choice' key={subIndustry.id}>
                                                    {subIndustry.name}
                                                    <i
                                                        onClick={() => {
                                                            setSelectedSubIndustries(prev => ({
                                                                ...prev,
                                                                [el.id]: prev[el.id].filter(id => id !== subIndustry.id)
                                                            }));
                                                        }}
                                                        className="bi bi-trash chosen__choice-delete"
                                                    ></i>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                        {/* Confirm and Cancel Buttons */}
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleConfirmChanges}
                                className="btn btn-success me-3"
                            >
                                Confirm Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
                {/* :
        <>
          <select
            defaultValue={''}
            onChange={''}
            className={`form-select signUpInput mt-2`}
            id="dashboardCompanymainType"
          >
          <option disabled value="">Select Industry</option>
          {
            allIndustries?.map(indus => (
              <option key={indus?.id} value={indus?.id}>{indus?.name}</option>
            ))
          }
          </select>
          
          {currentIndustryChoosen?.map((el) => (
            <span className='chosen__choice' key={el?.id}>
              {el?.name}
              <i 
                onClick={()=>handleDeleteBusinessType(el)}
                className="bi bi-trash chosen__choice-delete"
              ></i>
            </span>
          ))}
        </> */}

            </div>
        </form>
    )
}
