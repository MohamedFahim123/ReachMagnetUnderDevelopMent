import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';

let cache = {
    data: null,
    filterData: null,
    lastFetch: 0,
    lastFilterFetch: 0,
};

export const useDashBoardQuotationStore = create((set) => ({
    loading: true,
    quotations: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filteration: { type: '', date_from: '', date_to: '', code: '' },
    fetchAllQuotations: async (token, loginType, page = 1) => {
        const now = Date.now();
        if (cache.data && (now - cache.lastFetch < 180000)) {
            set({ quotations: cache.data, loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        const slug = loginType === 'user' ? `${loginType}/my-quotations` : `${loginType}/all-quotations`;

        try {
            const response = await axios.get(`${baseURL}/${slug}?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const quotations = response?.data?.data?.quotations;
            set({
                quotations,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
            cache = { ...cache, data: quotations, lastFetch: now };
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },
    filterQuotations: debounce(async (token, loginType, page = 1, filterParams = {}) => {
        set({ loading: true });
        const params = new URLSearchParams(filterParams).toString();
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-quotations?${params}&page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                quotations: response?.data?.data?.quotations,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    }, 1000),
    setCurrentPage: (page) => set({ currentPage: page }),
    setFilteration: (filter) => set({ filteration: filter }),
}));
