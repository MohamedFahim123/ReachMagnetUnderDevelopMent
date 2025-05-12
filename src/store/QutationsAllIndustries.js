import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";

export const GetQutationsAllIndustriesStore = create((set, get) => ({
  industriesQ: [],
  industriesQError: null,
  industriesQLoading: true,
  getAllIndustriesQ: async () => {
    const { industriesQ } = get();
    const now = new Date().getTime();
    if (industriesQ?.length > 0) {
      set({ industriesQLoading: false });
      return;
    }
    set({ industriesQLoading: true });
    await axios
      .get(`${baseURL}/all-industries?t=${now}`)
      .then((res) => {
        set(() => ({
          industriesQ: res?.data?.data?.industries,
          industriesQError: null,
          industriesQLoading: false,
        }));
      })
      .catch((err) =>
        set(() => ({
          industriesQ: [],
          industriesQError: err?.response?.data?.message,
          industriesQLoading: false,
        }))
      );
  },
}));
