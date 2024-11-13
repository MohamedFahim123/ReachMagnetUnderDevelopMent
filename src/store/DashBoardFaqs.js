import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardFaqsStore = create((set) => ({
    faqs: [],
    loading: true,
    unAuth: false,
    totalPages: 1,
    currentPage: 1,

    fetchFaqs: async (token, loginType, page = 1) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-faqs?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                faqs: response?.data?.data?.faqs,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteFaq: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-faq/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message);
            set((state) => ({
                faqs: state.faqs.filter((faq) => faq.id !== id),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting FAQ');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));
