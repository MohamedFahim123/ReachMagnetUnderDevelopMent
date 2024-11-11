import React, { useEffect, useRef, useState } from 'react'
import { baseURL } from '../../functions/baseUrl';
import axios from 'axios';
import { scrollToTop } from '../../functions/scrollToTop';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MyLoader from '../../components/myLoaderSec/MyLoader';

export default function MyCompaniesInsights({ token }) {
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);
    const [allowedCompany, SetAllowedCompany] = useState([]);
    const allTypes = [
        {
            type: 'news'
        },
        {
            type: 'discount'
        },
        {
            type: 'announcement'
        },
    ]
    const navigate = useNavigate();
    const location = useLocation();
    const initialized = useRef(false);
    const [formData, setFormData] = useState({
        company: '',  /* company id */
        type: '',
    });

    const fetchAllPosts = async (updatedFormData = formData) => {
        try {
            const queryString = buildQueryString(updatedFormData);
            const response = await axios.get(`${baseURL}/filter-posts?${queryString}&t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllPosts(response?.data?.data?.posts || []);

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error!');
        }
    };

    const fetchAllCompanyAllowed = async () => {
        try {
            const response = await axios.get(`${baseURL}/allowed-posts-companies?t=${new Date().getTime()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            SetAllowedCompany(response?.data?.data?.companies);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error!');
        }
    };

    const buildQueryString = (params) => {
        const query = new URLSearchParams();
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach(item => query.append(`${key}[]`, item));
            } else if (value) {
                query.append(key, value);
            }
        });
        return query.toString();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        fetchAllPosts(updatedFormData);
    };
    const clearFilters = () => {
        const clearedFormData = { company: '', type: '' };
        setFormData(clearedFormData);
        fetchAllPosts(clearedFormData);  // Fetch all posts without any filters
    };

    // Update URL with current filters
    const updateURLWithFilters = (data = formData) => {
        const queryString = buildQueryString(data);
        navigate(`?${queryString}`, { replace: true });
    };

    useEffect(() => {
        if (!initialized.current) {
            const queryParams = new URLSearchParams(location.search);
            const initialFormData = {
                company: queryParams.get('company') || '',
                type: queryParams.get('type') || '',
            };
            setFormData(initialFormData);
            fetchAllPosts(initialFormData);
            initialized.current = true;
        }
    }, [location.search]);

    useEffect(() => {
        if (initialized.current) {
            updateURLWithFilters();
        }
    }, [formData]);

    useEffect(() => {
        fetchAllCompanyAllowed();
    }, [token]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [loading]);

    return (
        <>
            {
                loading ?
                    <MyLoader />
                    :
                    <div className='MyAllCompanies__handler myCompaniesInsights__handler'>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-3 col-md-4">
                                    <div className="sidebarForItemsFilter__handler">
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationcompany">
                                                    Filter by Company
                                                </label>
                                                <select
                                                    name="company"
                                                    id="shopFilterationcompany"
                                                    className="form-control custom-select"
                                                    value={formData?.company}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select a company</option>
                                                    {
                                                        allowedCompany?.map((company) => (
                                                            <option key={company?.id} value={company?.id}>{company?.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <div className="catalog__new__input">
                                                <label htmlFor="shopFilterationcategory">
                                                    Filter by type
                                                </label>
                                                <select
                                                    name="type"
                                                    id="shopFilterationcategory"
                                                    className="form-control custom-select"
                                                    value={formData?.type}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="" disabled>Select post type</option>
                                                    {
                                                        allTypes?.map((type, index) => (
                                                            <option key={index} value={type?.type}>{type?.type}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="sidebarItemFilter">
                                            <button
                                                className='clearFilterBtn'
                                                onClick={clearFilters}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-8 ">
                                    <div className="allContentPosts__handler">
                                        {
                                            allPosts?.length === 0 ?
                                                <div className='text-danger fs-3 text-capitalize text-center mt-4'>
                                                    no insights
                                                </div>
                                                :
                                                <div className="row">
                                                    {
                                                        allPosts?.map((el) => {
                                                            return (
                                                                <div key={el?.id} className="col-lg-6 d-flex justify-content-center mb-3">
                                                                    <div className="news__card p-3">
                                                                        <div className="headOfNews__card d-flex justify-content-between align-items-start">
                                                                            <div className="headOfNews__card-leftPart">
                                                                                <div className="image">
                                                                                    <NavLink
                                                                                        onClick={() => {
                                                                                            scrollToTop();
                                                                                        }}
                                                                                        className={'nav-link'} to={`/show-company/${el?.company_id}`}>
                                                                                        <img src={el?.company_logo} alt="newImg" />
                                                                                    </NavLink>
                                                                                </div>
                                                                                <h4>{el?.title}</h4>
                                                                                <p>Type: {el?.type}</p>
                                                                                <p>{el?.created_at}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="news__card-body">
                                                                            <p>
                                                                                {
                                                                                    el?.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
