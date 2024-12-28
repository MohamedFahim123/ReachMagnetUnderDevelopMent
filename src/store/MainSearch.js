// import axios from "axios";
// import { create } from "zustand";
// import { baseURL } from "../functions/baseUrl";
// import toast from "react-hot-toast";
// import { Token } from "../functions/Token";

// export const SearchStore = create((set) => ({
//     currentData: [],
//     searchError: null,
//     searchLoading: false,
//     getCurrentSearchedData: async (search) => {
//         set({ searchLoading: true, searchError: null });
//         const toastId = toast.loading('Loading...');
//         try {
//             const response = await axios.get(`${baseURL}/general-search${search}`, {
//                 params: {
//                     t: new Date().getTime(),
//                 },
//                 headers: {
//                     "Content-Type": 'application/json',
//                     Accept: 'application/json',
//                     Authorization: `Bearer ${Token ? Token : ""}`,
//                 }
//             });
//             set({
//                 currentData: response?.data?.data?.companies || [],
//                 searchError: null,
//                 searchLoading: false,
//             });
//             toast.success(response?.data?.message || 'Data Loaded Successfully!', {
//                 id: toastId,
//                 duration: 1000
//             });
//         } catch (err) {
//             set({
//                 currentData: [],
//                 searchError: err?.response?.data?.message || 'Something Went Wrong!',
//                 searchLoading: false,
//             });
//             toast.error(err?.response?.data?.message || 'Something Went Wrong!', {
//                 id: toastId,
//                 duration: 1000
//             });
//         }
//     }
// }));


import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import toast from "react-hot-toast";
import { Token } from "../functions/Token";

export const SearchStore = create((set, get) => ({
    currentData: {
        companies: [],
        catalogs: [],
        services: [],
    },
    pagination: {
        companies: null,
        catalogs: null,
        services: null,
    },
    searchError: null,
    searchLoading: false,
    getCurrentSearchedData: async (search) => {
        set({ searchLoading: true, searchError: null });
        const toastId = toast.loading("Loading...");
        try {
            const response = await axios.get(`${baseURL}/general-search${search}`, {
                params: {
                    t: new Date().getTime(),
                },
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Token ? Token : ""}`,
                },
            });

            const companiesData = response?.data?.data?.companies || {};
            const catalogsData = response?.data?.data?.catalogs || {};
            const servicesData = response?.data?.data?.services || {};

            set({
                currentData: {
                    companies: companiesData.companies || [],
                    catalogs: catalogsData.catalogs || [],
                    services: servicesData.services || [],
                },
                pagination: {
                    companies: companiesData.meta || null,
                    catalogs: catalogsData.meta || null,
                    services: servicesData.meta || null,
                },
                searchError: null,
                searchLoading: false,
            });

            toast.success(response?.data?.message || "Data Loaded Successfully!", {
                id: toastId,
                duration: 1000,
            });
        } catch (err) {
            set({
                currentData: {
                    companies: [],
                    catalogs: [],
                    services: [],
                },
                pagination: {
                    companies: null,
                    catalogs: null,
                    services: null,
                },
                searchError: err?.response?.data?.message || "Something Went Wrong!",
                searchLoading: false,
            });
            toast.error(err?.response?.data?.message || "Something Went Wrong!", {
                id: toastId,
                duration: 1000,
            });
        }
    },

    appendData: async (search, type) => {
        set({ searchLoading: true, searchError: null });
        const toastId = toast.loading("Loading more...");
        try {
            const response = await axios.get(`${baseURL}/general-search${search}`, {
                params: { t: new Date().getTime() },
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Token ? Token : ""}`,
                },
            });

            const newData = response?.data?.data[type]?.[type] || [];
            const meta = response?.data?.data[type]?.meta || null;

            set((state) => ({
                currentData: {
                    ...state.currentData,
                    [type]: [...state.currentData[type], ...newData],
                },
                pagination: {
                    ...state.pagination,
                    [type]: meta,
                },
                searchError: null,
                searchLoading: false,
            }));

            toast.success(response?.data?.message || "More Data Loaded!", {
                id: toastId,
                duration: 1000,
            });
        } catch (err) {
            set({
                searchError: err?.response?.data?.message || "Something Went Wrong!",
                searchLoading: false,
            });
            toast.error(err?.response?.data?.message || "Something Went Wrong!", {
                id: toastId,
                duration: 1000,
            });
        }
    },
}));
