import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllRegionsStore = create((set, get) => ({
    regions: [],
    regionsError: null,
    regionsLoading: true,
    lastFetched: null,
    getAllRegions: async () => {
        const { lastFetched, regions } = get();
        const now = new Date().getTime();
        if (regions.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ regionsLoading: false });
            return;
        }
        set({ regionsLoading: true });
        await axios.get(`${baseURL}/regions`, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then(res => set(() => (
                {
                    regions: res?.data?.data?.regions,
                    regionsError: null,
                    regionsLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    regions: [],
                    regionsError: err?.response?.data?.message,
                    regionsLoading: false,
                    lastFetched: null,
                }
            )));
    },
}));
