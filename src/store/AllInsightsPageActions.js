// src/stores/insightsStore.js

import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useInsightsStore = create((set, get) => ({
    allPosts: [],
    allowedCompany: [],
    loading: true,
    formData: {
        company: '',
        type: '',
    },

    fetchAllCompanyAllowed: async (token) => {
        try {
            const response = await axios.get(`${baseURL}/allowed-posts-companies?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ allowedCompany: response?.data?.data?.companies });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error!');
        }
    },

    buildQueryString: (params) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach((item) => query.append(`${key}[]`, item));
            } else if (value) {
                query.append(key, value);
            }
        });
        return query.toString();
    },

    fetchAllPosts: async (token, updatedFormData = get().formData) => {
        try {
            set({ loading: true });
            const queryString = get().buildQueryString(updatedFormData);
            const response = await axios.get(`${baseURL}/filter-posts?${queryString}&t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ allPosts: response?.data?.data?.posts || [], loading: false });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error!');
            set({ loading: false });
        }
    },

    updateFormData: (name, value, token) => {
        const updatedFormData = { ...get().formData, [name]: value };
        set({ formData: updatedFormData });
        get().fetchAllPosts(token, updatedFormData);
    },

    clearFilters: (token) => {
        const clearedFormData = { company: '', type: '' };
        set({ formData: clearedFormData });
        get().fetchAllPosts(token, clearedFormData);
    },
}));
