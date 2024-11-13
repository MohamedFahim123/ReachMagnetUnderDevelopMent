import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardCatalogStore = create((set) => ({
    loading: true,
    catalogs: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filterCatalog: { status: 'active', title: '' },

    fetchCatalogs: async (token, loginType, page) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-catalogs?page=${page}&t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({
                catalogs: response?.data?.data?.catalogs,
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

    filterCatalogs: async (token, loginType, page, filterCatalog) => {
        set({ loading: true });
        const params = new URLSearchParams();
        for (const key in filterCatalog) {
            if (filterCatalog[key]) {
                params.append(key, filterCatalog[key]);
            }
        }
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
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

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
