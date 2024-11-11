import React, { useEffect, useState } from 'react'
import './myDefaultRoles.css'
import axios from 'axios';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';

export default function MyDefaultRoles({token,setUnAuth}) {
    const loginType = localStorage.getItem('loginType');
    const [permissions, setPermissions] = useState([]);
    const [allRoles,setAllRoles] = useState([]);
    const [loadingPermissions,setLoadingPermissions] = useState(false);
    let counter = 0;

    const gettingAllRoles = async ()=>{
        axios.get(`${baseURL}/${loginType}/roles?t=${new Date().getTime()}`,{
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setAllRoles(prevRoles => {
                const lastShape = [...prevRoles , ...response?.data?.data?.roles];
                return lastShape;
            });
        }).catch(error => {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            };
            toast.error(error?.response?.data?.message);
        });
    };

    useEffect(()=>{
        if(allRoles.length === 0){
            gettingAllRoles();
        };
    },[allRoles]);

    const gettingSingleRulePermissions = async (id) => {
        if(id && !permissions?.find(el => +el?.permissionId === +id)){
            setPermissions([]);
            setLoadingPermissions(true);
            await axios.get(`${baseURL}/${loginType}/roles-show/${id}?t=${new Date().getTime()}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setPermissions(response?.data?.data?.permissions);
                setLoadingPermissions(false);
            }).catch(error=>{
                if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                    setUnAuth(true);
                };
                toast.error(error?.response?.data?.message);
            });
        };
    };

    const [expandedRole, setExpandedRole] = useState(null);

    const toggleRole = (id) => {
        counter = 0;
        gettingSingleRulePermissions(id);
        setExpandedRole(prevId => (prevId === id ? null : id));
    };

    const getStyle = (enable) => ({
        color: enable ? '#000' : 'rgba(0, 0, 0, 0.3)'
    });

    const handleDeleteThisRule = async (id) => {
        await axios.delete(`${baseURL}/${loginType}/roles-delete/${id}?t=${new Date().getTime()}`,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            setAllRoles(allRoles?.filter(role => +role?.id !== +id));
            toast.success(response?.data?.message);
        }).catch(error=>{
            console.log(error);
            toast.error(error?.response?.data?.message);
        });
    };

    return (
        <div className='myDefaultRoles__handler'>
            {allRoles?.map((role) => (
                <div key={role.id} className="oneRole__item__box mb-5">
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h3 className='role__tit d-flex align-items-center' onClick={() => toggleRole(role?.id)}>
                            <i className={`bi ${expandedRole === role?.id ? 'bi-chevron-compact-down' : 'bi-chevron-compact-right'}`}></i>
                            <span>{role?.name}</span>
                        </h3>
                        <div>
                            <button className="deleteRuleBtn" onClick={() => handleDeleteThisRule(role?.id)}>Remove Role</button>
                        </div>
                    </div>
                    {expandedRole === role?.id && (
                        <>
                            <p className='role__desc d-flex '>
                                <i className="bi bi-exclamation-circle"></i>
                                <span>
                                    Owners have view and edit access to user management by default which cannot be changed.
                                    Every member gets basic permissions and functionality by default. You can customize settings for all members or make local adjustments for individual users in their profiles.
                                </span>
                            </p>
                            <h3 className='permission__header'>Permissions</h3>
                            <div className="allPermission__items">
                                <table className="table table-responsive">
                                    <tbody>
                                        {loadingPermissions ? 
                                            <div className="permissionsLoader"></div>
                                        :
                                            permissions?.map((perm ) =>{
                                                return(
                                                (perm?.enable === true) &&
                                                <tr key={perm?.id} className='onePermission__handler'>
                                                    <th className='permission__id' scope="row" style={getStyle(perm?.enable)}>{++counter}.</th>
                                                    <td className='permission__tit' style={getStyle(perm?.enable)}>{perm?.name}</td>
                                                    <td>
                                                        <div className="switch-container">
                                                            <label className="switch">
                                                            
                                                                <input
                                                                    type="checkbox"
                                                                    defaultChecked
                                                                />
                                                                <span className="slider"></span>
                                                            </label>
                                                            <span className="toggle-text" style={getStyle(perm?.enable)}>{perm?.enable ? 'Yes' : 'No'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )} )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}
