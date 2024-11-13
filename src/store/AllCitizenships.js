import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllCitizenshipsStore = create((set, get) => ({
    citizenships: [],
    citizenshipsError: null,
    citizenshipsLoading: true,
    lastFetched: null,
    getAllCitizenships: async () => {
        const { lastFetched, citizenships } = get();
        const now = new Date().getTime();
        if (citizenships.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ citizenshipsLoading: false });
            return;
        }
        set({ citizenshipsLoading: true });
        await axios.get(`${baseURL}/citizenships`, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        })
            .then(res => set(() => (
                {
                    citizenships: res?.data?.data?.citizenships,
                    citizenshipsError: null,
                    citizenshipsLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    citizenships: [],
                    citizenshipsError: err?.response?.data?.message,
                    citizenshipsLoading: false,
                    lastFetched: null,
                }
            )));
    },
}));
