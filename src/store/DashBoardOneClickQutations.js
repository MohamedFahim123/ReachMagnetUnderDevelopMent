
import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

export const useDashBoardOneClickQuotationStore = create((set, get) => ({
    loading: true,
    quotations: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filteration: { code: '', type: '', activeRole: 'All' }, // Add activeRole here

    fetchAllQuotations: async (token, loginType, page = 1) => {
        const slug = loginType === 'user'
            ? `${loginType}/my-one-click-quotations`
            : `${loginType}/all-one-click-quotations`;
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${slug}?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                quotations: response?.data?.data?.one_click_quotations,
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

    filterQuotations: debounce(async (token, loginType, filterParams, page = 1) => {
        const params = new URLSearchParams(filterParams).toString();
        set({ loading: true });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-one-click-quotations?${params}&page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                quotations: response?.data?.data?.one_click_quotations,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    }, 1000),

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilteration: (filter) => set({ filteration: filter }), // Pass new activeRole here as needed
}));
