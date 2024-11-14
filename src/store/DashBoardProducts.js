import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardProductsStore = create((set, get) => ({
    loading: true,
    products: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    lastFetched: null,

    fetchProducts: async (token, loginType, page = 1) => {
        const { lastFetched } = get();
        const now = Date.now();
        const threeMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < threeMinutes) {
            set({ loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/all-products?page=${page}&t=${now}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                products: response?.data?.data?.products,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
                lastFetched: now,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteProduct: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-product-data/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message);
            set((state) => ({
                products: state.products.filter((item) => item.id !== id),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting product');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));
