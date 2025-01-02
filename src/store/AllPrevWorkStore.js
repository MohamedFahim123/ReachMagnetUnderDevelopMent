import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const usePrevWorkStore = create((set, get) => ({
    loading: true,
    prevWork: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filterCatalog: { status: 'active', title: '' },
    lastFetched: null,

    fetchPrevWork: async (token, loginType, page = 1) => {
        const { lastFetched } = get();
        const now = Date.now();
        const threeMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < threeMinutes) {
            set({ loading: false });
            return;
        };

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-pervious-works?page=${page}&t=${now}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                prevWork: response?.data?.data?.pervious_works,
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


    deletePrevWork: async (token, loginType, id) => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-pervious-work/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response?.data?.message || 'Deleted Successfully',{
                id: toastId,
                duration: 1000,
            });
            set((state) => ({
                prevWork: state.prevWork.filter((work) => work.id !== id)
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting Previous Work',{
                id: toastId,
                duration: 1500,
            });
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilterCatalog: (filter) => set({ filterCatalog: filter }),
}));
