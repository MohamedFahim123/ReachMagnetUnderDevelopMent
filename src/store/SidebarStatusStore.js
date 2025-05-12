import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { Token } from '../functions/Token';

export const useSidebarStatus = create((set, get) => ({
    loading: true,
    ShowStatus: {},
    message: '',
    unAuth: false,

    fetchSidebarStatus: async ( loginType) => {
        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/sidebar-status?t=${new Date().getTime()}`, {
               headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            });

            set({
                ShowStatus: response?.data?.data?.show,
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
            ShowStatus: {},
            message: '',
            unAuth: false,
        });
    },
}));
