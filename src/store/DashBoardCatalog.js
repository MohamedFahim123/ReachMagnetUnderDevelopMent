import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import debounce from "lodash/debounce";

export const useDashBoardCatalogStore = create((set, get) => ({
    loading: true,
    catalogs: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filterCatalog: { status: 'active', title: '' },
    lastFetched: null,

    fetchCatalogs: async (token, loginType, page) => {
        const { lastFetched } = get();
        const now = Date.now();
        const threeMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < threeMinutes) {
            set({ loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-catalogs?page=${page}&t=${now}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({
                catalogs: response?.data?.data?.catalogs,
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

    filterCatalogs: debounce(async (token, loginType, page, filterCatalog) => {
        const params = new URLSearchParams();
        for (const key in filterCatalog) {
            if (filterCatalog[key]) {
                params.append(key, filterCatalog[key]);
            }
        }

        set({ loading: true });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-catalogs?${params.toString()}&page=${page}&t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({
                catalogs: response?.data?.data?.catalogs,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
                lastFetched: Date.now(),  // Update timestamp on success only
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    }, 1000),  

    deleteCatalog: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-catalog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response?.data?.message || 'Deleted Successfully');
            set((state) => ({ catalogs: state.catalogs.filter((item) => item.id !== id) }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting catalog');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilterCatalog: (filter) => set({ filterCatalog: filter }),
}));
