import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useNetworkStore = create((set) => ({
    loading: true,
    networks: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filterCatalog: { status: 'active', title: '' },

    fetchNetwork: async (token, loginType, page = 1) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-company-networks?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                networks: response?.data?.data?.networks,
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

    filterCatalogs: async (token, loginType, page = 1, filterCatalog) => {
        set({ loading: true });
        const params = new URLSearchParams();
        for (const key in filterCatalog) {
            if (filterCatalog[key]) {
                params.append(key, filterCatalog[key]);
            }
        }
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-catalogs?${params.toString()}&page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                networks: response?.data?.data?.catalogs,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteNetwork: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-company-network/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response?.data?.message || 'Deleted Successfully');
            set((state) => ({
                networks: state.networks.filter((network) => network.id !== id)
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting network');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilterCatalog: (filter) => set({ filterCatalog: filter }),
}));
