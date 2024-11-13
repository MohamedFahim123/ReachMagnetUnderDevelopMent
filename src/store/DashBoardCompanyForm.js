import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardFormDataStore = create((set) => ({
    loading: true,
    formData: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    selectedFormId: null,
    showModal: false,

    fetchFormData: async (token, loginType, page = 1) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-form-data?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                formData: response?.data?.data?.formData,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteFormData: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-form-data/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message);
            set((state) => ({
                formData: state.formData.filter((item) => item.formId !== id),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting form data');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setSelectedFormId: (formId) => set({ selectedFormId: formId, showModal: true }),
    closeModal: () => set({ selectedFormId: null, showModal: false }),
}));
