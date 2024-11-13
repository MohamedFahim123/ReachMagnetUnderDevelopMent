import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllMainActivitiesStore = create((set, get) => ({
    mainActivities: [],
    mainActivitiesError: null,
    mainActivitiesLoading: true,
    lastFetched: null,
    getAllMainActivities: async () => {
        const { lastFetched, mainActivities } = get();
        const now = new Date().getTime();
        if (mainActivities.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ mainActivitiesLoading: false });
            return;
        }
        set({ mainActivitiesLoading: true });
        await axios.get(`${baseURL}/main-activities`, {
            headers: {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            }
        })
            .then(res => set(() => (
                {
                    mainActivities: res?.data?.data?.mainActivities,
                    mainActivitiesError: null,
                    mainActivitiesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    mainActivities: [],
                    mainActivitiesError: err?.response?.data?.message,
                    mainActivitiesLoading: false,
                    lastFetched: null,
                }
            )));
    }
}));