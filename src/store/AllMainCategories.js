import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const GetAllMainCategoriesStore = create((set, get) => ({
    mainCategories: [],
    mainCategoriesError: null,
    mainCategoriesLoading: true,
    lastFetched: null,
    getAllMainCategories: async () => {
        const { lastFetched, mainCategories } = get();
        const now = new Date().getTime();
        if (mainCategories.length > 0 && lastFetched && now - lastFetched < 900000) {
            set({ mainCategoriesLoading: false });
            return;
        }
        set({ mainCategoriesLoading: true });
        await axios.get(`${baseURL}/main-categories`, {
            headers: {
                headers: Token ? { Authorization: `Bearer ${Token}` } : {}
            }
        })
            .then(res => set(() => (
                {
                    mainCategories: res?.data?.data?.mainCategories,
                    mainCategoriesError: null,
                    mainCategoriesLoading: false,
                    lastFetched: now,
                }
            )))
            .catch(err => set(() => (
                {
                    mainCategories: [],
                    mainCategoriesError: err?.response?.data?.message,
                    mainCategoriesLoading: false,
                    lastFetched: null,
                }
            )));
    }
}));