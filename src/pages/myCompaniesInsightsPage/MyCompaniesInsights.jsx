import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import MyLoader from '../../components/myLoaderSec/MyLoader';
import { scrollToTop } from '../../functions/scrollToTop';
import { useInsightsStore } from '../../store/AllInsightsPageActions';

export default function MyCompaniesInsights({ token }) {
    const navigate = useNavigate();
    const location = useLocation();
    const initialized = useRef(false);
    const {
        allPosts,
        allowedCompany,
        loading,
        formData,
        fetchAllPosts,
        fetchAllCompanyAllowed,
        updateFormData,
        clearFilters,
        buildQueryString,
    } = useInsightsStore();
    const allTypes = [
        { type: 'news' },
        { type: 'discount' },
        { type: 'announcement' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value, token);
    };

    const updateURLWithFilters = () => {
        const queryString = buildQueryString(formData);
        navigate(`?${queryString}`, { replace: true });
    };

    useEffect(() => {
        if (!initialized.current) {
            const queryParams = new URLSearchParams(location.search);
            const initialFormData = {
                company: queryParams.get('company') || '',
                type: queryParams.get('type') || '',
            };
            updateFormData('company', initialFormData.company, token);
            updateFormData('type', initialFormData.type, token);
            initialized.current = true;
        }
    }, [location.search, token, updateFormData]);

    useEffect(() => {
        if (initialized.current) {
            updateURLWithFilters();
        }
    }, [formData]);

    useEffect(() => {
        fetchAllCompanyAllowed(token);
    }, [token, fetchAllCompanyAllowed]);

    return (
        <>
            {loading ? (
                <MyLoader />
            ) : (
                <div className='MyAllCompanies__handler myCompaniesInsights__handler'>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-4">
                                <div className="sidebarForItemsFilter__handler">
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationcompany">Filter by Company</label>
                                            <select
                                                name="company"
                                                id="shopFilterationcompany"
                                                className="form-control custom-select"
                                                value={formData?.company}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>Select a company</option>
                                                {allowedCompany?.map((company) => (
                                                    <option key={company?.id} value={company?.id}>{company?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <div className="catalog__new__input">
                                            <label htmlFor="shopFilterationcategory">Filter by type</label>
                                            <select
                                                name="type"
                                                id="shopFilterationcategory"
                                                className="form-control custom-select"
                                                value={formData?.type}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>Select post type</option>
                                                {allTypes?.map((type, index) => (
                                                    <option key={index} value={type?.type}>{type?.type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sidebarItemFilter">
                                        <button className='clearFilterBtn' onClick={() => clearFilters(token)}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-8 ">
                                <div className="allContentPosts__handler">
                                    {allPosts?.length === 0 ? (
                                        <div className='text-danger fs-3 text-capitalize text-center mt-4'>
                                            No insights
                                        </div>
                                    ) : (
                                        <div className="row">
                                            {allPosts?.map((el) => (
                                                <div key={el?.id} className="col-lg-6 d-flex justify-content-center mb-3">
                                                    <div className="news__card p-3">
                                                        <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                                            <div className="headOfNews__card-leftPart">
                                                                <div className="image">
                                                                    <NavLink
                                                                        onClick={() => scrollToTop()}
                                                                        className='nav-link'
                                                                        to={`/show-company/${el?.company_id}`}
                                                                    >
                                                                        <img src={el?.company_logo} alt="newImg" />
                                                                    </NavLink>
                                                                </div>
                                                                <h4>{el?.title}</h4>
                                                                <p>Type: {el?.type}</p>
                                                                <p>{el?.created_at}</p>
                                                            </div>
                                                        </div>
                                                        <div className="news__card-body">
                                                            <p>{el?.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
