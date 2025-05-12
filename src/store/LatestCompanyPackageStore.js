import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';
import { Token } from '../functions/Token';

export const useLatestPackageStore = create((set, get) => ({
    loading: true,
    companyPackageStatus: [],
    currentPackage: '',
    packages: [],
    message: '',
    unAuth: false,

    fetchLatestCompanyPackage: async (loginType) => {
        if (loginType !== 'employee') return;
        const now = new Date().getTime();

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/latest-company-package?t=${now}`, {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            });

            set({
                companyPackageStatus: response?.data?.data?.company_package_status || [],
                packages: response?.data?.data?.packages || [],
                currentPackage: response?.data?.data?.current_package,
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
            companyPackageStatus: [],
            packages: [],
            message: '',
            unAuth: false,
        });
    },
}));
