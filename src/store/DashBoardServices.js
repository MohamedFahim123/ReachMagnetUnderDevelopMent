import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardServiceStore = create((set) => ({
    loading: true,
    services: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filterService: { status: 'active', title: '' },

    fetchServices: async (token, loginType, page = 1) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-services?page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                services: response?.data?.data?.services,
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

    filterServices: async (token, loginType, page = 1, filterService) => {
        set({ loading: true });
        const params = new URLSearchParams();
        for (const key in filterService) {
            if (filterService[key]) {
                params.append(key, filterService[key]);
            }
        }
        try {
            const response = await axios.get(`${baseURL}/${loginType}/filter-services?${params.toString()}&page=${page}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({
                services: response?.data?.data?.services,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteService: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-service/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response?.data?.message || 'Deleted Successfully');
            set((state) => ({
                services: state.services.filter((service) => service.id !== id)
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting service');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilterService: (filter) => set({ filterService: filter }),
}));
