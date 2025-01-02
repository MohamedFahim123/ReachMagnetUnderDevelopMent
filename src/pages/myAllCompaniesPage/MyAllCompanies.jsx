import React, { useEffect, useRef, useState } from "react";
import "./myAllCompanies.css";
import locationIcon from "../../assets/icons/Duotone.png";
import userIcon from "../../assets/icons/Duotone3.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { scrollToTop } from "../../functions/scrollToTop";
import MyLoader from "../../components/myLoaderSec/MyLoader";
import { useCompaniesStore } from "../../store/FIlterCompanies";

export default function MyAllCompanies() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const initialized = useRef(false);
    const [formData, setFormData] = useState({
        name: "",
        main_type: [],
        product_name: "",
        service_name: "",
        category_id: "",
        sub_category_id: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const {
        companies,
        totalPages,
        uniqueAllowedCompNames,
        uniqueAllowedCompTypes,
        categories,
        subCategories,
        companiesLoading,
        fetchCompanies,
    } = useCompaniesStore();

    const buildQueryString = (params) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach((item) => query.append(`${key}[]`, item));
            } else if (value) {
                query.append(key, value);
            }
        });
        return query.toString();
    };

    const hasFilters = () => {
        return Object.values(formData).some((value) => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value !== "";
        });
    };

    const updateURLWithFilters = () => {
        const queryString = buildQueryString(formData);
        navigate(`?${queryString}`, { replace: true });
    };

    useEffect(() => {
        if (!initialized.current) {
            const queryParams = new URLSearchParams(location.search);
            const initialFormData = {
                name: queryParams.get("name") || "",
                main_type: queryParams.getAll("main_type[]") || [],
                product_name: queryParams.get("product_name") || "",
                service_name: queryParams.get("service_name") || "",
                category_id: queryParams.get("category_id") || "",
                sub_category_id: queryParams.get("sub_category_id") || "",
            };
            setFormData(initialFormData);
            initialized.current = true;
            fetchCompanies(currentPage, initialFormData);
        }
    }, [location.search, fetchCompanies, currentPage]);

    useEffect(() => {
        if (initialized.current) {
            fetchCompanies(currentPage, formData);
            updateURLWithFilters();
        }
    }, [formData, currentPage, fetchCompanies]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value ? [value] : [],
        }));
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            category_id: value,
            sub_category_id: "",
        }));
    };

    const clearFilters = () => {
        setFormData({
            name: "",
            main_type: [],
            product_name: "",
            service_name: "",
            category_id: "",
            sub_category_id: "",
        });
        navigate("?");
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            scrollToTop(500);
        }
    };
console.log(companies);

    return (
        <>
            {companiesLoading || loading ? (
                <MyLoader />
            ) : (
                <div className="MyAllCompanies__handler">
                    <div className="container">
                        <h1 className="mb-4">Companies</h1>
                        <div className="row">
                            <div className="col-lg-3 col-md-4">
                                <div className="sidebarForItemsFilter__handler">
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationtitle">
                                                Filter by Product
                                            </label>
                                            <input
                                                type="text"
                                                name="product_name"
                                                id="shopFilterationtitle"
                                                className="form-control"
                                                placeholder={`Enter your text`}
                                                value={formData?.product_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationServ">
                                                Filter by Service
                                            </label>
                                            <input
                                                type="text"
                                                name="service_name"
                                                id="shopFilterationServ"
                                                className="form-control"
                                                placeholder={`Enter your text`}
                                                value={formData?.service_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationcompany">
                                                Filter by Company
                                            </label>
                                            <select
                                                name="name"
                                                id="shopFilterationcompany"
                                                className="form-control custom-select"
                                                value={formData?.name}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>
                                                    Select a company
                                                </option>
                                                {uniqueAllowedCompNames?.map((company, index) => (
                                                    <option key={index} value={company}>
                                                        {company}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationcategory">
                                                Filter by Category
                                            </label>
                                            <select
                                                name="category_id"
                                                id="shopFilterationcategory"
                                                className="form-control custom-select"
                                                value={formData?.category_id}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="" disabled>
                                                    Select Category
                                                </option>
                                                {categories?.map((category, index) => (
                                                    <option key={index} value={category.categoryId}>
                                                        {category.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationsubcategory">
                                                Filter by Sub-Category
                                            </label>
                                            <select
                                                name="sub_category_id"
                                                id="shopFilterationsubcategory"
                                                className="form-control custom-select"
                                                value={formData?.sub_category_id}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>
                                                    Select Sub-Category
                                                </option>
                                                {subCategories
                                                    .filter((subCat) => subCat.categoryId === formData.category_id)
                                                    .map((subCategory, index) => (
                                                        <option key={index} value={subCategory.subCategoryId}>
                                                            {subCategory.subCategoryName}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationSorting">
                                                <span>filter by Company Types</span>
                                            </label>
                                            <select
                                                id="shopFilterationSorting"
                                                name="main_type"
                                                className="form-control custom-select"
                                                value={formData.main_type[0] || ""}
                                                onChange={handleSelectChange}
                                            >
                                                <option value="" disabled>
                                                    Select Sorting Type
                                                </option>
                                                {uniqueAllowedCompTypes?.map((type, index) => (
                                                    <option key={index} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <button className="clearFilterBtn" onClick={clearFilters}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-8">
                                <div className="mainContentAllCompanies__handler">
                                    {companies?.length === 0 ? (
                                        <div className="row">
                                            <div className="col-12">
                                                <h1 className="text-danger fs-3 text-capitalize text-center mt-4">
                                                    no company with this filter
                                                </h1>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="row gap-3">
                                            {companies?.map((el) => (
                                                <div key={el?.id} className="col-12">
                                                    <div className="CompanyContentItem">
                                                        <div className="compImage">
                                                            <NavLink to={`/show-company/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                                            <img src={el?.companyLogo} alt={el?.companyName} />
                                                            </NavLink>
                                                        </div>
                                                        <div className="compMainInfo">
                                                            <h5 className="mb-2">
                                                                <NavLink to={`/show-company/${el?.companySlug}`} target="_blank" className={'nav-link'}>
                                                                {el?.companyName}
                                                                </NavLink>
                                                            </h5>
                                                            <div className="companySubInfo mb-2">
                                                                <div className="subInfoItem">
                                                                    <img src={userIcon} alt="user-icon" />
                                                                    <span>{el?.companyIndustries[0]?.industryName}</span>
                                                                </div>
                                                                <div className="subInfoItem">
                                                                    <img src={locationIcon} alt="location-icon" />
                                                                    <span>{el?.companyBranches[0]?.branchCity}</span>
                                                                </div>
                                                            </div>
                                                            <div className="companyDescrip mb-2">
                                                                <p className="cursorPointer" title={el?.companyAboutUs}>
                                                                {el?.companyAboutUs?.length > 200
                                                                ? `${el.companyAboutUs.slice(0, 200)}...`
                                                                : el.companyAboutUs}
                                                                </p>
                                                            </div>
                                                            <div className="companyMainCountry">
                                                                <i className="bi bi-crosshair2"></i>
                                                                <span>{el?.companyBranches[0]?.branchCountry}</span>
                                                            </div>
                                                        </div>
                                                        <div className="companyActions">
                                                            <NavLink
                                                                onClick={() => scrollToTop()}
                                                                className="nav-link"
                                                                to={`/show-company/${el?.companySlug}`}
                                                            >
                                                                <button className="pageMainBtnStyle">more info</button>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center align-items-center mt-4">
                                        <button
                                            type="button"
                                            className="paginationBtn me-2"
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            <i className="bi bi-caret-left-fill"></i>
                                        </button>
                                        <span className="currentPagePagination">{currentPage}</span>
                                        <button
                                            type="button"
                                            className="paginationBtn ms-2"
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            <i className="bi bi-caret-right-fill"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
