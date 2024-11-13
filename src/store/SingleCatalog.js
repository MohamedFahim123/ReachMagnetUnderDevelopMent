import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useCatalogStore = create((set) => ({
    currentCatalog: {},
    loading: true,
    fetchCatalog: async (catalogId, token) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${baseURL}/show-catalog/${catalogId}?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ currentCatalog: response?.data?.data?.catalog, loading: false });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something Went Wrong!', { duration: 1000 });
            set({ loading: false });
        }
    },
}));
