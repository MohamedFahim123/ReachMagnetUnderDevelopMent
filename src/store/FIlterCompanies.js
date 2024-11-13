import axios from "axios";
import { create } from "zustand";
import { baseURL } from "../functions/baseUrl";
import { Token } from "../functions/Token";

export const useCompaniesStore = create((set) => ({
    companies: [],
    totalPages: 1,
    uniqueAllowedCompNames: [],
    uniqueAllowedCompTypes: [],
    categories: [],
    subCategories: [],
    companiesError: null,
    companiesLoading: false,
    fetchCompanies: async (currentPage, formData) => {
        set({ companiesLoading: true, companiesError: null });
        try {
            const hasFilters = () => formData && Object.keys(formData).length > 0;
            const buildQueryString = (params) => {
                return new URLSearchParams(params).toString();
            };
            const queryString = hasFilters() ? buildQueryString(formData) : "";
            const endpoint = hasFilters()
                ? `${baseURL}/filter-companies?${queryString}`
                : `${baseURL}/filter-companies`;

            const response = await axios.get(endpoint, {
                params: {
                    t: new Date().getTime(),
                    page: currentPage,
                    limit: 12,
                },
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            });

            const companiesData = response?.data?.data?.companies || [];
            const totalPagesData = response?.data?.data?.total_pages || 1;

            const companyAllowedNames = companiesData.map((item) => item.companyName);
            const companyAllowedTypes = companiesData.flatMap((item) =>
                item.companyTypes.map((typeObj) => typeObj.type)
            );
            const companyCategories = companiesData.map((item) => ({
                categoryId: item.companyCategoryId,
                categoryName: item.companyCategory,
            }));
            const companySubCategories = companiesData.map((item) => ({
                subCategoryId: item.companySubCategoryId,
                subCategoryName: item.companySubCategory,
            }));

            set({
                companies: companiesData,
                totalPages: totalPagesData,
                uniqueAllowedCompNames: [...new Set(companyAllowedNames)],
                uniqueAllowedCompTypes: [...new Set(companyAllowedTypes)],
                categories: [
                    ...new Set(companyCategories.map((cat) => JSON.stringify(cat))),
                ].map((str) => JSON.parse(str)),
                subCategories: [
                    ...new Set(companySubCategories.map((subCat) => JSON.stringify(subCat))),
                ].map((str) => JSON.parse(str)),
                companiesLoading: false,
            });
        } catch (error) {
            console.error("Error fetching companies:", error);
            set({
                companiesError: error.message,
                companiesLoading: false,
            });
        }
    },
}));
