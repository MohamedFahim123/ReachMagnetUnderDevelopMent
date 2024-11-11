import React from 'react';
import './unAuth.css';

export default function UnAuthSec() {
    return (
        <div className='unAuthorizedSection text-danger text-center w-100 d-flex justify-content-center align-items-center my-5 fs-1'>
            <h2>
                You don't have the Permission to reach this page
            </h2>
        </div>
    )
}
