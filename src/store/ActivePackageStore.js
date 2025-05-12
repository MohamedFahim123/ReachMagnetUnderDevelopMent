import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { Token } from '../functions/Token';

export const useActivePackageStore = create((set, get) => ({
    loading: true,
    features: {},
    message: '',
    unAuth: false,

    fetchActivePackage: async ( loginType) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/active-company-package?t=${new Date().getTime()}`, {
               headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            });

            set({
                features: response?.data?.data?.features,
                message: response?.data?.message || '',
                loading: false,
            });
        } catch (error) {
            if (error?.response?.status === 401) {
                set({ unAuth: true });
            } else {
                console.log(error?.response?.data?.message);
                
            }
            set({ loading: false });
        }
    },

    resetStore: () => {
        set({
            loading: false,
            features: {},
            message: '',
            unAuth: false,
        });
    },
}));
