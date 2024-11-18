import { create } from 'zustand';
import axios from 'axios';
import { baseURL } from '../functions/baseUrl';
import toast from 'react-hot-toast';

export const useDashBoardBookedAppointmentsStore = create((set, get) => ({
    // State
    loading: true,
    appointments: [],
    unAuth: false,
    totalPages: 1,
    currentPage: 1,
    filteration: { date: '', type: '' },
    activeRole: 'All',
    lastFetched: null,

    // Fetch appointments
    fetchBookedAppointments: async (token, loginType, page = 1, ) => {
        set({ loading: true, unAuth: false });

        const slug = loginType !== 'user' ? 'all-booked-appointments' : 'get-user-appointments';

        try {
            const response = await axios.get(
                `${baseURL}/${loginType}/${slug}?page=${page}&t=${Date.now()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            set({
                appointments: response?.data?.data?.bookedAppointments || [],
                totalPages: response?.data?.data?.meta?.last_page || 1,
                loading: false,
            });
        } catch (error) {
            if (error?.response?.status === 401) {
                set({ unAuth: true });
            }
            toast.error(error?.response?.data?.message || 'Something Went Wrong!');
            set({ loading: false });
        }
    },

    // Filter booked appointments
    filterBooked: async (token, loginType, page = 1) => {
        const { filteration } = get();
        const queryParams = new URLSearchParams(filteration).toString();

        if (queryParams) {
            try {
                const response = await axios.get(
                    `${baseURL}/${loginType}/filter-booked-appointments?${queryParams}&page=${page}&t=${Date.now()}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                set({
                    appointments: response?.data?.data?.bookedAppointments || [],
                    totalPages: response?.data?.data?.meta?.last_page || 1,
                    loading: false,
                });
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Something Went Wrong!');
                set({ loading: false });
            }
        } else {
            get().fetchBookedAppointments(token, loginType, page);
        }
    },

    // Set filteration
    setFilteration: (newFilter, token, loginType) => {
        const { filterBooked } = get();
        set((state) => ({
            filteration: { ...state.filteration, ...newFilter },
            currentPage: 1, // Reset to first page when filter changes
        }));
        filterBooked(token, loginType, 1); // Fetch filtered appointments
    },

    // Set active role and update filteration
    setActiveRole: (role, token, loginType) => {
        const { setFilteration } = get();
        const type = role === 'All' ? '' : role;
        set({ activeRole: role });
        setFilteration({ type }, token, loginType);
    },

    // Set current page and fetch new data
    setCurrentPage: (page, token, loginType) => {
        const { filterBooked } = get();
        set({ currentPage: page });
        filterBooked(token, loginType, page);
    },

    // Delete an appointment
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

    // Update appointment status
    updateAppointmentStatus: async (token, loginType, id, status, meetingLink = null) => {
        const toastId = toast.loading('Loading...');
        try {
            const response = await axios.post(
                `${baseURL}/${loginType}/update-booked-appointment-status/${id}&t=${Date.now()}`,
                {
                    status,
                    link: meetingLink,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(response?.data?.message || 'Status updated successfully', {
                id: toastId,
                duration: 1500,
            });
            set((state) => ({
                appointments: state.appointments.map((appointment) =>
                    appointment.id === id ? { ...appointment, status, link: meetingLink } : appointment
                ),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error updating status', {
                id: toastId,
                duration: 1500,
            });
        }
    },
}));

