import axios from "axios";
import { baseURL } from "./baseUrl";

export const getDataFromAPI = async (slug, auth) => {
    const response = await axios.get(`${baseURL}/${slug}?t=${new Date().getTime()}`, auth);
    return response?.data?.data;
};