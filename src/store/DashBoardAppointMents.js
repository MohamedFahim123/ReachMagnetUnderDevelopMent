import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardAppointmentsStore = create((set, get) => ({
    loading: true,
    appointments: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    lastFetched: null,

    fetchAppointments: async (token, loginType, page = 1) => {
        const { lastFetched } = get();
        const now = Date.now();
        const fiveMinutes = 3 * 60 * 1000;

        if (lastFetched && now - lastFetched < fiveMinutes) {
            set({ loading: false });
            return;
        }

        set({ loading: true, unAuth: false });
        try {
            const response = await axios.get(`${baseURL}/${loginType}/appointments?page=${page}&t=${now}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                appointments: response?.data?.data?.appointments,
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
        };
    },

    deleteAppointment: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-appointments/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response?.data?.message || 'Deleted Successfully');
            set((state) => ({
                appointments: state.appointments.filter((appointment) => appointment.id !== id),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error deleting appointment');
        };
    },

    setCurrentPage: (page) => set({ currentPage: page }),
}));
