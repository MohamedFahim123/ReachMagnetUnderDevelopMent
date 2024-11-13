import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardBookedAppointmentsStore = create((set) => ({
    loading: true,
    appointments: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filteration: { date: '', type: '' },
    activeRole: 'All',

    fetchBookedAppointments: async (token, loginType, page = 1, filteration = {}) => {
        set({ loading: true, unAuth: false });
        const slug = loginType !== 'user' ? 'all-booked-appointments' : 'get-user-appointments';
        const queryParams = new URLSearchParams(filteration).toString();
        try {
            const response = await axios.get(`${baseURL}/${loginType}/${slug}?page=${page}&${queryParams}&t=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                appointments: response?.data?.data?.bookedAppointments,
                totalPages: response?.data?.data?.meta?.last_page,
                loading: false,
            });
        } catch (error) {
            if (error?.response?.data?.message === 'Server Error' || error?.response?.data?.message === 'Unauthorized') {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    deleteAppointment: async (token, loginType, id) => {
        try {
            const response = await axios.delete(`${baseURL}/${loginType}/delete-booked-appointment/${id}`, {
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
        }
    },

    updateAppointmentStatus: async (token, loginType, id, status) => {
        try {
            const response = await axios.post(`${baseURL}/${loginType}/update-booked-appointment-status/${id}&t=${new Date().getTime()}`, {
                status,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(response?.data?.message || 'Status updated successfully');
            set((state) => ({
                appointments: state.appointments.map((appointment) =>
                    appointment.id === id ? { ...appointment, status } : appointment
                ),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error updating status');
        }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
    setFilteration: (filter) => set({ filteration: filter }),
    setActiveRole: (role) => set({ activeRole: role }),
}));
