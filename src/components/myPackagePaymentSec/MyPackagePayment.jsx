import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseURL } from '../../functions/baseUrl';

export default function MyPackagePayment({ token, loginType }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    const handlePaymentSubmit = async (data) => {
        const toastId = toast.loading('Submitting payment...');
        const formData = new FormData();

        try {
            // Append the required data to the FormData
            formData.append('payment_type', 'offline'); // Fixed payment type
            formData.append('payment_method', data.payment_method);
            if (data.attachment[0]) {
                formData.append('attachment', data.attachment[0]); // Attach the uploaded file
            }

            // API call
            const response = await axios.post(
                `${baseURL}/${loginType}/pay-package-cost`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            toast.success(`${response.data.message}`, { id: toastId });
            reset(); // Reset the form after successful submission
        } catch (error) {
            toast.dismiss(toastId);
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors || {};
                Object.values(apiErrors).forEach((errorMessages) =>
                    errorMessages.forEach((message) => toast.error(message))
                );
            } else {
                toast.error(error.response?.data?.message || 'Error submitting payment');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h3>Payment Information</h3>
            <form onSubmit={handleSubmit(handlePaymentSubmit)}>
                <div className="mb-3">
                    <label htmlFor="payment_method" className="form-label">Payment Method</label>
                    <select
                        id="payment_method"
                        className="form-select"
                        {...register('payment_method', { required: 'Payment method is required' })}
                    >
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="payment_link">Payment Link</option>
                    </select>
                    {errors.payment_method && <small className="text-danger">{errors.payment_method.message}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="attachment" className="form-label">Attachment (optional)</label>
                    <input
                        type="file"
                        id="attachment"
                        className="form-control"
                        {...register('attachment')}
                        accept=".png, .jpg, .jpeg, .jfif, .pdf"
                    />
                    {errors.attachment && <small className="text-danger">{errors.attachment.message}</small>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                </button>
            </form>
        </div>
    );
}
