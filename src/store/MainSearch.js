import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import toast from "react-hot-toast";
import { Token } from "../functions/Token";

export const SearchStore = create((set) => ({
    currentData: [],
    searchError: null,
    searchLoading: false,
    getCurrentSearchedData: async (search) => {
        set({ searchLoading: true, searchError: null });
        const toastId = toast.loading('Loading...');
        try {
            const response = await axios.get(`${baseURL}/general-search${search}`, {
                params: {
                    t: new Date().getTime(),
                },
                headers: {
                    "Content-Type": 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${Token ? Token : ""}`,
                }
            });
            set({
                currentData: response?.data?.data?.companies || [],
                searchError: null,
                searchLoading: false,
            });
            toast.success(response?.data?.message || 'Data Loaded Successfully!', {
                id: toastId,
                duration: 1000
            });
        } catch (err) {
            set({
                currentData: [],
                searchError: err?.response?.data?.message || 'Something Went Wrong!',
                searchLoading: false,
            });
            toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
                id: toastId,
                duration: 1000
            });
        }
    }
}));
