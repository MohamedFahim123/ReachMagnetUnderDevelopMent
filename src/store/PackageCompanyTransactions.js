import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { Token } from '../functions/Token';

export const usePackageTransactions = create((set, get) => ({
    loading: true,
    transactions: [],
    message: '',
    unAuth: false,

    fetchCompanyTransactions: async (loginType) => {
        if (loginType !== 'employee') return;
        const now = new Date().getTime();

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/packages-transactions?t=${now}`, {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            });

            set({
                transactions: response?.data?.data?.transactions || [],
                message: response?.data?.message || '',
                loading: false,
            });
        } catch (error) {
            if (error?.response?.status === 401) {
                set({ unAuth: true });
            } else {
                toast.error(error?.response?.data?.message || 'An error occurred');
                console.error(error);
            }
            set({ loading: false });
        }
    },

    resetStore: () => {
        set({
            loading: false,
            transactions: [],
            message: '',
            unAuth: false,
        });
    },
}));
