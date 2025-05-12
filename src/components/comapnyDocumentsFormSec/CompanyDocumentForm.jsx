import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../../functions/baseUrl';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function CompanyDocumentForm({ token, setUnAuth }) {
    const loginType = localStorage.getItem('loginType');
    const [currCompanyDocument, setCurrCompanyDocument] = useState([]);
    const [editMode, setEditMode] = useState({}); // Store edit mode per document ID

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (token && loginType === 'employee') {
            (async () => {
                try {
                    const response = await axios.get(
                        `${baseURL}/${loginType}/show-company?t=${new Date().getTime()}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setCurrCompanyDocument(response?.data?.data?.companyDocuments || []);
                } catch (error) {
                    toast.error(error?.response?.data?.message || 'Error fetching documents');
                }
            })();
        }
    }, [token, loginType]);

    const handleCustomSubmit = async (data, docId) => {
        const toastId = toast.loading('Updating document...');
        const formData = new FormData();

        try {
            // Append the document ID and file
            formData.append('company_document_id', String(docId)); // Send document ID
            if (data.document[0]) {
                formData.append('document', data.document[0]); // Attach the selected file
            } else {
                toast.error('No file selected.');
                return;
            }

            const response = await axios.post(
                `${baseURL}/${loginType}/update-company-documents?t=${new Date().getTime()}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(`${response?.data?.message}`, { id: toastId });
            // Refresh the documents after updating
            setCurrCompanyDocument((prev) =>
                prev.map((doc) =>
                    doc.id === docId
                        ? { ...doc, document: URL.createObjectURL(data.document[0]) }
                        : doc
                )
            );
            setEditMode((prev) => ({ ...prev, [docId]: false })); // Exit edit mode for this document
        } catch (error) {
            toast.dismiss(toastId);
            if (error?.response?.status === 422) {
                const apiErrors = error?.response?.data?.errors || {};
                Object.values(apiErrors).forEach((errorMessages) => {
                    errorMessages.forEach((message) => toast.error(message));
                });
            } else if (error?.response?.data?.message === 'Unauthorized') {
                setUnAuth(true);
            } else {
                toast.error(error?.response?.data?.message || 'Error updating document');
            }
        }
    };
    const isImage = (url) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = url.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    };
    return (
        <div>
            <h3 className='mb-4 fs-4'>Company Documents</h3>
            {currCompanyDocument.map((doc) => (
                <div key={doc.id} className="mb-4">
                    <div className="d-flex align-items-center">
                        {doc.type === 'image' ? (
                            <img
                                src={doc?.document}
                                alt={`Document ${doc?.id}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                            />
                        ) : (
                            <a href={doc?.document} target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-file-earmark"></i> View File
                            </a>
                        )}
                        {!editMode[doc.id] ? (
                            <button
                                className="btn btn-primary ms-3"
                                onClick={() => setEditMode((prev) => ({ ...prev, [doc.id]: true }))}
                            >
                                Edit
                            </button>
                        ) : (
                            <button
                                className="btn btn-secondary ms-3"
                                onClick={() => setEditMode((prev) => ({ ...prev, [doc.id]: false }))}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    {editMode[doc.id] && (
                        <form
                            onSubmit={handleSubmit((data) => handleCustomSubmit(data, doc.id))}
                            className="mt-2"
                        >
                            <input
                                type="file"
                                className="form-control"
                                {...register('document', { required: true })}
                                accept=".pdf, .jpg, .jpeg, .png, .webp"
                            />
                            {errors.document && (
                                <small className="text-danger">Please select a valid file.</small>
                            )}
                            <button
                                type="submit"
                                className="btn btn-success mt-2"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}
