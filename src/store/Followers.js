import { create } from "zustand";
import axios from "axios";
import { baseURL } from "../functions/baseUrl";
import toast from "react-hot-toast";

export const useFollowersStore = create((set) => ({
    loading: true,
    followers: [],
    followed: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    activeRole: "Followers",
    fetchFollowers: async (token, loginType, currentPage) => {
        set({ loading: true, unAuth: false });
        try {
            let followersData = [],
                followedData = [];
            
            if (loginType === "user") {
                const response = await axios.get(`${baseURL}/user/followed-companies?page=${currentPage}&t=${new Date().getTime()}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                followersData = response?.data?.data?.followedCompanies;
            } else if (loginType === "employee") {
                const [followersResponse, followedResponse] = await Promise.all([
                    axios.get(`${baseURL}/employee/company-followers?page=${currentPage}&t=${new Date().getTime()}`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get(`${baseURL}/employee/followed-companies?page=${currentPage}&t=${new Date().getTime()}`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);
                followersData = followersResponse?.data?.data?.followers;
                followedData = followedResponse?.data?.data?.followedCompanies;
            }

            set({
                followers: followersData,
                followed: followedData,
                loading: false,
                totalPages: 1,
            });
        } catch (error) {
            if (error?.response?.data?.message === "Server Error" || error?.response?.data?.message === "Unauthorized") {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || "Error fetching data");
            set({ loading: false });
        }
    },

    setCurrentPage: (newPage) => set({ currentPage: newPage }),
    setActiveRole: (role) => set({ activeRole: role }),
}));
