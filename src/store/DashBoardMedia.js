import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardMediaStore = create((set, get) => ({
    loading: true,
    mediaItems: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filteration: { type: '' },
    activeRole: 'All',
    lastFetched: null,

    fetchMedias: async (token, loginType, page = 1) => {
        const { lastFetched } = get();
        const now = Date.now();
        const threeMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < threeMinutes) {
            set({ loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/company-portfolios?page=${page}&t=${now}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                mediaItems: response?.data?.data?.portfolio,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
                lastFetched: now,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    filterMedias: async (token, loginType, page = 1, filteration) => {
        set({ loading: true });
        const params = new URLSearchParams();
        for (const key in filteration) {
            if (filteration[key]) {
                params.append(key, filteration[key]);
            }
        }
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-company-portfolios?${params.toString()}&page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                mediaItems: response?.data?.data?.portfolio,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteMediaItem: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-company-portfolio/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response?.data?.message || 'Deleted Successfully');
            set((state) => ({
                mediaItems: state.mediaItems.filter((item) => item.id !== id),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting media');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilteration: (filter) => set({ filteration: filter }),
    setActiveRole: (role) => set({ activeRole: role }),
}));