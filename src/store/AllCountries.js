import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllCountriesStore = create((set, get) => ({
    countries: [],
    allowedCountries: [],
    countriesError: null,
    countriesLoading: true,
    lastFetched: null,
    getAllCountries: async () => {
        const { lastFetched, countries } = get();
        const now = new Date().getTime();
        if (countries.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ countriesLoading: false });
            return;
        };
        set({ countriesLoading: true });
        await axios.get(`${baseURL}/countries`, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then(res => set(() => (
                {
                    countries: res?.data?.data?.countries,
                    countriesError: null,
                    countriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    countries: [],
                    countriesError: err?.response?.data?.message,
                    countriesLoading: false,
                    lastFetched: null,
                }
            )));
    },
    getAllAllowedCountries: async () => {
        const { lastFetched, allowedCountries } = get();
        const now = new Date().getTime();
        if (allowedCountries.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ countriesLoading: false });
            return;
        }
        set({ countriesLoading: true });
        await axios.get(`${baseURL}/company-countries?t=${now}`, {
            headers: {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            }
        })
            .then(res => set(() => (
                {
                    allowedCountries: res?.data?.data?.countries,
                    countriesError: null,
                    countriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    allowedCountries: [],
                    countriesError: err?.response?.data?.message,
                    countriesLoading: false,
                    lastFetched: null,
                }
            )));
    },
}));
