import React, { useEffect, useState } from 'react';
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function CompanySlugForm({ token, setUnAuth }) {
    const loginType = localStorage.getItem('loginType');
    const [currCompanySlug, setCurrCompanySlug] = useState('');
    const [editMode, setEditMode] = useState(false);

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            slug: '',
        },
    });

    // Fetch current company slug
    useEffect(() => {
        if (token && loginType === 'employee' && !editMode) {
            (async () => {
                try {
                    const response = await axios.get(
                        `${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    const slug = response?.data?.data?.slug;
                    setCurrCompanySlug(slug);
                    setValue('slug', slug); // Set the default value for the input
                } catch (error) {
                    toast.error(error?.response?.data?.message || 'Error fetching slug');
                }
            })();
        }
    }, [token, loginType, editMode, setValue]);

    // Handle form submission
    const handleCustomSubmit = async () => {
        const data = getValues(); // Get the current form values
        const toastId = toast.loading('Please Wait...');
        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/update-company-slug?t=${new Date().getTime()}`,
                { slug: data.slug },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(`${response?.data?.message}`, { id: toastId, duration: 1000 });
            setCurrCompanySlug(data.slug); // Update the current slug
            setEditMode(false); // Exit edit mode
        } catch (error) {
            toast.dismiss(toastId); // Dismiss the loading toast
            if (error?.response?.status === 422 && error?.response?.data?.errors?.slug) {
                const apiError = error?.response?.data?.errors?.slug[0];
                if (apiError === 'The Slug field format is invalid.') {
                    toast.error('English letters or numbers separated by - are required');
                } else {
                    toast.error(apiError);
                }
            } else if (error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            } else {
                toast.error(error?.response?.data?.message || 'Error updating slug');
            }
        }
    };

    return (
        <form>
        <div className="mb-3">
            <label htmlFor="slug" className="form-label">Company Slug</label>
            <input
                type="text"
                id="slug"
                className="form-control"
                {...register('slug', { required: true })}
                disabled={!editMode} // Disable input if not in edit mode
            />
            {errors.slug && <small className="text-danger">Slug is required</small>}
        </div>
        <div className="d-flex justify-content-between">
            {!editMode ? (
                <button
                    type="button" // Prevent triggering form submission
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                >
                    Edit
                </button>
            ) : (
                <>
                    <button
                        type="button" // Use type="button" to avoid default form submission
                        className="btn btn-success"
                        onClick={handleCustomSubmit} // Attach custom submission handler
                        disabled={isSubmitting}
                    >
                        Submit
                    </button>
                    <button
                        type="button" // Prevent triggering form submission
                        className="btn btn-secondary"
                        onClick={() => {
                            setEditMode(false); // Cancel editing
                            setValue('slug', currCompanySlug); // Reset input value to current slug
                        }}
                    >
                        Cancel
                    </button>
                </>
            )}
        </div>
        </form>
    );
}
