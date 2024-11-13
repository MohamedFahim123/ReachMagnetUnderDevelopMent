import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllCompaniesStore = create((set) => ({
    companies: [],
    companiesError: null,
    companiesLoading: true,

    getAllCompanies: async () => {
        set({ companiesLoading: true, companiesError: null });

        try {
            const response = await axios.get(`${baseURL}/companies`, {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            });

            set({
                companies: response?.data?.data?.companies || [],
                companiesError: null,
                companiesLoading: false,
            });
        } catch (err) {
            set({
                companies: [],
                companiesError: err.response?.data?.message || "Failed to load companies.",
                companiesLoading: false,
            });
        }
    }
}));
