import React from 'react'
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../functions/scrollToTop';

export default function AddNewItem({link}) {
    const navigate = useNavigate();
    return (
        <div className='addNewItem__btn text-lg-end'>
            <button onClick={() => {
                scrollToTop();
                navigate(link);
            }}>
                Add New Item
            </button>
        </div>
    );
};