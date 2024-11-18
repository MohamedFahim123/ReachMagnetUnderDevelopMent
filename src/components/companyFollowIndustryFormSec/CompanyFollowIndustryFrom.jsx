import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function CompanyFollowIndustryFrom({ token, setUnAuth }) {
    const loginType = localStorage.getItem('loginType')
    const [currIndustries, setCurrIndustries] = useState([]);
    const [allIndustries, setAllIndustries] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
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
        }
    };

    // Remove industry from selection
    // const handleRemoveIndustry = async (industryId) => {
    //     if (loginType === 'user') {
    //         // Ensure the industry exists in the current industries
    //         const isCurrentIndustry = currIndustries.some((ind) => ind.id === industryId);
    //         if (!isCurrentIndustry) {
    //             toast.error('Cannot delete an industry that is not associated with the user.');
    //             return;
    //         }
    
    //         try {
    //             await axios.post(
    //                 `${baseURL}/user/unfollow-industry?t=${new Date().getTime()}`,
    //                 { industry_id:  String(industryId) },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //             toast.success('Industry removed successfully');
    //             fetchCurrentIndustries(); // Refresh the current industries
    //         } catch (error) {
    //             const errorMessage = error?.response?.data?.errors?.industry_id?.[0] || 'Failed to remove industry';
    //             toast.error(errorMessage);
    //         }
    //     } else {
    //         setSelectedIndustries(selectedIndustries.filter((ind) => ind.id !== industryId));
    //     }
    // };

    // Confirm changes
    console.log(selectedIndustries);
    
// const handleConfirmChanges = async () => {
//     if (loginType === 'user') {
//         try {
//             const industryIds = selectedIndustries.map((ind) => ind.id);
//             await axios.post(
//                 `${baseURL}/user/follow-industries`,
//                 { industry_id: industryIds },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             toast.success('Industries updated successfully');
//             fetchCurrentIndustries(); // Fetch updated industries to ensure consistency
//             setIsEditing(false); // Exit edit mode
//         } catch (error) {
//             const errorMessage = error?.response?.data?.errors?.industry_id?.[0] || 'Failed to update industries';
//             toast.error(errorMessage);
//         }
//     } else {
//         const industryIds = selectedIndustries.map((ind) => ind.id);
//         try {
//             const response = await axios.post(
//                 `${baseURL}/employee/update-company-industires`,
//                 {
//                     industry_id: industryIds,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             toast.success('Industries updated successfully');
//             fetchCurrentIndustries(); // Refresh the current industries list
//             setIsEditing(false); // Exit edit mode
//         } catch (error) {
//             toast.error(error?.response?.data.message || 'Failed to update industries');
//         }
//     }
// };


    // console.log(currIndustries);
    
    // const handleConfirmChanges = async () => {
    //     if (loginType === 'user') {
    //         // Determine additions and removals
    //         const industriesToFollow = selectedIndustries.map((ind) => ind.id); // Send all selected industries
    //         const industriesToUnfollow = currIndustries.filter(
    //             (currInd) => !selectedIndustries.some((ind) => ind.id === currInd.id)
    //         );
    
    //         try {
    //             // Follow all selected industries
    //             if (industriesToFollow.length > 0) {
    //                 await axios.post(
    //                     `${baseURL}/user/follow-industries?t=${new Date().getTime()}`,
    //                     { industry_id: industriesToFollow },
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     }
    //                 );
    //                 toast.success('Industries updated successfully');
    //             }
    
    //             // Unfollow removed industries
    //             if (industriesToUnfollow.length > 0) {
    //                 for (const industry of industriesToUnfollow) {
    //                     await axios.post(
    //                         `${baseURL}/user/unfollow-industry?t=${new Date().getTime()}`,
    //                         { industry_id: String(industry.id) }, // Ensure industry_id is sent as string
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${token}`,
    //                             },
    //                         }
    //                     );
    //                 }
    //                 toast.success('Industries removed successfully');
    //             }
    
    //             // Refresh industries and exit edit mode
    //             fetchCurrentIndustries();
    //             setIsEditing(false);
    //         } catch (error) {
    //             const errorMessage =
    //             error?.response?.data?.errors?.industry_id?.[0] ||
    //             error?.response?.data?.message ||
    //             'Failed to update industries';
    //         toast.error(errorMessage);
    //         }
    //     } else {
    //         // Handle employee logic
    //         const industryIds = selectedIndustries.map((ind) => ind.id);
    //         try {
    //             await axios.post(
    //                 `${baseURL}/employee/update-company-industires`,
    //                 { industry_id: industryIds },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //             toast.success('Industries updated successfully');
    //             fetchCurrentIndustries(); // Refresh the current industries list
    //             setIsEditing(false); // Exit edit mode
    //         } catch (error) {
    //             toast.error(error?.response?.data.message || 'Failed to update industries');
    //         }
    //     }
    // };

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
            try {
                await axios.post(
                    `${baseURL}/employee/update-company-industires`,
                    { industry_id: industryIds },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success('Industries updated successfully');
                fetchCurrentIndustries(); // Refresh the current industries list
                setIsEditing(false); // Exit edit mode
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
                    // View mode: Show current industries with "Update" button
                    <>
                        <div>
                            {currIndustries.map((el) => (
                                <span className='chosen__choice' key={el?.id}>
                                    {el?.name}
                                </span>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(true); // Enable edit mode
                                    setSelectedIndustries(currIndustries); // Pre-fill selected industries
                                }}
                                className="btn btn-primary"
                            >
                                Update
                            </button>
                        </div>
                    </>
                ) : (
                    // Edit mode: Show dropdown, selected industries, and confirm button
                    <>
                        {/* Dropdown for selecting industries */}
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
                        <div className="mt-3">
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
