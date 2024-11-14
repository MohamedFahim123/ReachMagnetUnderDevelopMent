import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllIndustriesStore = create((set, get) => ({
    industries: [],
    selectedIndustries: [],
    industriesError: null,
    industriesLoading: true,
    lastFetched: null,
    getAllIndustries: async () => {
        const { lastFetched, industries } = get();
        const now = new Date().getTime();
        if (industries.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ industriesLoading: false });
            return;
        }
        set({ industriesLoading: true });
        await axios.get(`${baseURL}/industries?t=${now}`, {
            headers: Token ? { Authorization: `Bearer ${Token}` } : {}
        })
            .then(res => set(() => (
                {
                    industries: res?.data?.data?.industries,
                    industriesError: null,
                    industriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    industries: [],
                    industriesError: err?.response?.data?.message,
                    industriesLoading: false,
                    lastFetched: null,
                }
            )));
    },
    getAllSelectedIndustries: async () => {
        const { lastFetched, selectedIndustries } = get();
        const now = new Date().getTime();
        if (selectedIndustries?.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ countriesLoading: false });
            return;
        }
        set({ countriesLoading: true });
        await axios.get(`${baseURL}/selected-industries`, {
            headers: Token ? { Authorization: `Bearer ${Token}` } : {}
        })
            .then(res => set(() => (
                {
                    selectedIndustries: res?.data?.data?.industries,
                    countriesError: null,
                    countriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    selectedIndustries: [],
                    countriesError: err?.response?.data?.message,
                    countriesLoading: false,
                    lastFetched: null,
                }
            )));
    }
}));